import assert from 'assert'
import axios from 'axios'

type CapturedRequest = {
  method?: string
  url?: string
  params?: Record<string, unknown>
  headers?: Record<string, unknown>
  data?: unknown
}

const originalPost = axios.post
const originalGet = axios.get
const originalRequest = axios.request
const requests: CapturedRequest[] = []

const lastRequest = (method: string, url: string) => {
  const request = requests[requests.length - 1]
  assert(request, 'Expected a Delhivery B2B request to be captured')
  assert.equal(request.method, method)
  assert.equal(request.url, url)
  assert.equal(request.headers?.Authorization, 'Bearer test-jwt')
  assert(request.headers?.['X-Request-Id'], 'Expected X-Request-Id header')
  return request
}

const run = async () => {
  process.env.DATABASE_URL ||= 'postgresql://test:test@127.0.0.1:5432/test'
  const { DelhiveryB2BService } = await import(
    '../models/services/couriers/delhiveryB2B.service'
  )

  ;(axios as any).post = async (url: string, data: unknown, config?: CapturedRequest) => {
    requests.push({ method: 'POST', url, data, headers: config?.headers })
    if (url.endsWith('/ums/login')) {
      return { data: { success: true, data: { jwt: 'test-jwt' } } }
    }
    return { data: { success: true } }
  }
  ;(axios as any).get = async (url: string, config?: CapturedRequest) => {
    requests.push({ method: 'GET', url, ...config })
    return { data: { success: true } }
  }
  ;(axios as any).request = async (config: CapturedRequest) => {
    requests.push(config)
    return { data: { success: true } }
  }

  const service = new DelhiveryB2BService({
    apiBase: 'https://ltl-clients-api-dev.delhivery.com/',
    username: 'test-account',
    password: 'test-password',
    clientId: 'test-client',
    warehouseId: 'test-warehouse',
    freightMode: 'fop',
    fmPickup: true,
  })

  await service.resetPassword('test-account')
  assert.equal(requests.at(-1)?.url, 'https://ltl-clients-api-dev.delhivery.com/forgot-password')

  const loginStart = requests.length
  const loginResults = await Promise.all([service.login(), service.login(), service.login()])
  const loginRequests = requests
    .slice(loginStart)
    .filter((request) => request.url?.endsWith('/ums/login'))
  assert.equal(loginRequests.length, 1, 'Concurrent API calls must share one login request')
  assert.equal(loginRequests[0].url, 'https://ltl-clients-api-dev.delhivery.com/ums/login')
  assert.deepEqual(loginRequests[0].data, {
    username: 'test-account',
    password: 'test-password',
  })
  assert.equal(loginRequests[0].headers?.['Content-Type'], 'application/json')
  assert(loginResults.every((result) => result.token === 'test-jwt'))

  await service.checkServiceability('122001', 1000)
  const serviceabilityRequest = lastRequest('GET', '/pincode-service/122001')
  assert.equal(serviceabilityRequest.params?.weight, 1000)
  assert.equal(serviceabilityRequest.headers?.['Content-Type'], 'application/json')

  await service.checkServiceability('122001')
  assert.equal(lastRequest('GET', '/pincode-service/122001').params, undefined)

  await assert.rejects(() => service.checkServiceability('12201', 1000), /6-digit/)
  await assert.rejects(() => service.checkServiceability('122001', Number.NaN), /weight/)

  await service.getExpectedTat('400093', '122001')
  const tatRequest = lastRequest('GET', '/tat/estimate')
  assert.deepEqual(tatRequest.params, {
    origin_pin: '400093',
    destination_pin: '122001',
  })
  assert.equal(tatRequest.headers?.Authorization, 'Bearer test-jwt')
  assert.equal(typeof tatRequest.headers?.['X-Request-Id'], 'string')

  assert.throws(() => service.getExpectedTat('40009', '122001'), /origin_pin.*6-digit/)
  assert.throws(
    () => service.getExpectedTat('400093', 'destination'),
    /destination_pin.*6-digit/,
  )

  await service.estimateFreight({
    dimensions: [{ length_cm: 11, width_cm: 1.1, height_cm: 11, box_count: 1 }],
    weight_g: 100000,
    cheque_payment: false,
    source_pin: '400069',
    consignee_pin: '400069',
    payment_mode: 'prepaid',
    inv_amount: 123,
    rov_insurance: true,
  })
  const freightEstimate = lastRequest('POST', '/freight/estimate')
  assert.deepEqual(freightEstimate.data, {
    dimensions: [{ length_cm: 11, width_cm: 1.1, height_cm: 11, box_count: 1 }],
    weight_g: 100000,
    cheque_payment: false,
    source_pin: '400069',
    consignee_pin: '400069',
    payment_mode: 'prepaid',
    inv_amount: 123,
    rov_insurance: true,
    freight_mode: 'fop',
  })
  assert.equal(freightEstimate.headers?.['Content-Type'], 'application/json')

  await assert.rejects(
    () =>
      service.estimateFreight({
        dimensions: [{ length_cm: 11, width_cm: 1.1, height_cm: 11, box_count: 1 }],
        weight_g: 100000,
        source_pin: '400069',
        consignee_pin: '400069',
        payment_mode: 'cod',
        inv_amount: 123,
        freight_mode: 'fod',
      }),
    /cod_amount/,
  )
  await assert.rejects(
    () => service.estimateFreight({ payment_mode: 'prepaid' }),
    /dimensions/,
  )

  await service.getFreightCharges(' 220029522, 220029147 ,220029160 ')
  const freightCharges = lastRequest(
    'GET',
    '/lrn/freight-breakup/lrns=220029522%2C220029147%2C220029160',
  )
  assert.equal(freightCharges.headers?.Authorization, 'Bearer test-jwt')
  assert.equal(typeof freightCharges.headers?.['X-Request-Id'], 'string')

  const maximumLrns = Array.from({ length: 25 }, (_, index) => String(220000000 + index))
  await service.getFreightCharges(maximumLrns)
  lastRequest('GET', `/lrn/freight-breakup/lrns=${encodeURIComponent(maximumLrns.join(','))}`)

  assert.throws(() => service.getFreightCharges(' , , '), /lrns is required/i)

  await service.createWarehouse({ name: 'Test Warehouse', pin_code: '122001' })
  lastRequest('POST', '/client-warehouse/create/')

  await service.updateWarehouse({ cl_warehouse_name: 'Test Warehouse', update_dict: {} })
  lastRequest('PATCH', '/client-warehouses/update')

  await service.manifestShipment({
    pickup_location_name: 'Test Warehouse',
    shipment_details: [{ order_id: 'ORDER-1', box_count: 1 }],
    doc_file: {
      buffer: Buffer.from('invoice'),
      mimetype: 'application/pdf',
      originalname: 'invoice.pdf',
    },
  })
  const manifest = lastRequest('POST', '/manifest')
  assert(manifest.data instanceof FormData)
  assert.equal((manifest.data as FormData).get('pickup_location_name'), 'Test Warehouse')
  assert.equal(((manifest.data as FormData).get('doc_file') as File).name, 'invoice.pdf')

  await service.getManifestStatus('manifest-job')
  assert.equal(lastRequest('GET', '/manifest').params?.job_id, 'manifest-job')

  await service.updateShipment('220110457', {
    consignee_name: 'Updated Consignee',
    invoice_file: [
      {
        buffer: Buffer.from('invoice'),
        mimetype: 'application/pdf',
        originalname: 'updated-invoice.pdf',
      },
    ],
  })
  const update = lastRequest('PUT', '/lrn/update/220110457')
  assert(update.data instanceof FormData)
  assert.equal(((update.data as FormData).get('invoice_file') as File).name, 'updated-invoice.pdf')

  await service.getShipmentUpdateStatus('update-job')
  assert.equal(lastRequest('GET', '/lrn/update/status').params?.job_id, 'update-job')

  await service.cancelShipment('220110457')
  lastRequest('DELETE', '/lrn/cancel/220110457')

  await service.trackShipment('220110457', true)
  assert.deepEqual(lastRequest('GET', '/lrn/track').params, {
    lrnum: '220110457',
    all_wbns: true,
  })

  await service.bookLastMileAppointment({ lrn: '220110457', date: '23/07/2026' })
  lastRequest('POST', '/v2/appointments/lm')

  await service.createPickupRequest({ client_warehouse: 'Test Warehouse' })
  lastRequest('POST', '/pickup_requests')

  await service.cancelPickupRequest('pur-id-1')
  lastRequest('DELETE', '/pickup_requests/pur-id-1')

  await service.getShippingLabel('220110457', 'a4')
  lastRequest('GET', '/label/get_urls/a4/220110457')

  await service.getLrCopy('220110457', ['SHIPPER COPY', 'LM POD'])
  assert.equal(
    lastRequest('GET', '/lr_copy/print/220110457').params?.lr_copy_type,
    'SHIPPER COPY,LM POD',
  )

  await service.generateDocument('shipping_label', { lrns: ['220110457'], size: 'a4' })
  lastRequest('POST', '/generate/shipping_label')

  await service.generateDocument('lr_copy', { lrns: ['220110457'] })
  lastRequest('POST', '/generate/lr_copy')

  await service.getGenerateDocumentStatus('shipping_label', 'document-job')
  lastRequest('GET', '/generate/shipping_label/status/document-job')

  await service.downloadDocument({ lrn: '220110457', doc_type: 'LM_POD' })
  assert.equal(lastRequest('GET', '/document/download').params?.doc_type, 'LM_POD')

  await service.logout()
  assert.equal(requests.at(-1)?.url, 'https://ltl-clients-api-dev.delhivery.com/ums/logout')
  assert.equal(requests.at(-1)?.method, 'GET')
  assert.equal(requests.at(-1)?.headers?.Authorization, 'Bearer test-jwt')
  assert.equal(requests.at(-1)?.headers?.['Content-Type'], 'application/json')

  assert.equal(
    requests.filter((request) => request.url?.endsWith('/ums/login')).length,
    1,
    'Expected the JWT to be reused instead of logging in for every API request',
  )

  assert.throws(
    () => service.getFreightCharges(Array.from({ length: 26 }, (_, index) => String(index))),
    /maximum of 25 LRNs/i,
  )

  console.log(`Delhivery B2B API contract checks passed (${requests.length} requests).`)
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    ;(axios as any).post = originalPost
    ;(axios as any).get = originalGet
    ;(axios as any).request = originalRequest
  })
