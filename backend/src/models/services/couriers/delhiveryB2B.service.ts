import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { randomUUID } from 'crypto'
import { HttpError } from '../../../utils/classes'
import {
  DelhiveryB2BCredentials,
  getDelhiveryB2BCredentials,
} from '../delhiveryB2BCredentials.service'

type CredentialsOverride = Partial<DelhiveryB2BCredentials> & { apiBase: string }

export type DelhiveryB2BUpload = {
  buffer: Buffer
  mimetype: string
  originalname: string
}

type CachedToken = {
  credentialKey: string
  token: string
  expiresAt: number
}

type LoginResult = {
  token: string
  expiresAt: number
  cached: boolean
}

type InFlightLogin = {
  credentialKey: string
  promise: Promise<LoginResult>
}

let cachedToken: CachedToken | null = null
let loginInFlight: InFlightLogin | null = null

const clean = (value: unknown) => String(value ?? '').trim()
const timeoutMs = () => {
  const configured = Number(process.env.DELHIVERY_B2B_REQUEST_TIMEOUT_MS || 30000)
  return Number.isFinite(configured) && configured > 0 ? configured : 30000
}

const trimBaseUrl = (value: string) => value.replace(/\/+$/, '')

const extractMessage = (value: unknown): string | null => {
  if (!value) return null
  if (typeof value === 'string') return value.trim() || null
  if (Array.isArray(value)) {
    for (const entry of value) {
      const message = extractMessage(entry)
      if (message) return message
    }
    return null
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of ['message', 'detail', 'error', 'errors', 'remark', 'remarks']) {
      const message = extractMessage(record[key])
      if (message) return message
    }
  }
  return null
}

const parseJwtExpiry = (token: string) => {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
    const expiresAt = Number(payload?.exp || 0) * 1000
    return expiresAt > Date.now() ? expiresAt : Date.now() + 23 * 60 * 60 * 1000
  } catch {
    return Date.now() + 23 * 60 * 60 * 1000
  }
}

const tokenFromResponse = (data: any) =>
  clean(data?.data?.jwt || data?.data?.token || data?.jwt || data?.token || data?.access_token)

const makeCredentialKey = (credentials: DelhiveryB2BCredentials) =>
  `${credentials.apiBase}|${credentials.username}|${credentials.password}`

const ensureRequired = (value: unknown, field: string) => {
  const normalized = clean(value)
  if (!normalized) throw new HttpError(400, `${field} is required for Delhivery B2B`)
  return normalized
}

const ensurePincode = (value: unknown, field = 'pincode') => {
  const pincode = ensureRequired(value, field)
  if (!/^\d{6}$/.test(pincode)) {
    throw new HttpError(400, `${field} must be a 6-digit Indian postal code`)
  }
  return pincode
}

const optionalWeightGrams = (value: unknown) => {
  if (value === undefined || value === null || value === '') return undefined
  const weight = Number(value)
  if (!Number.isFinite(weight) || weight < 0) {
    throw new HttpError(400, 'weight must be a non-negative number in grams')
  }
  return weight
}

const ensureNumber = (value: unknown, field: string, minimum = 0) => {
  const number = Number(value)
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    typeof value === 'boolean' ||
    typeof value === 'object' ||
    !Number.isFinite(number)
  ) {
    throw new HttpError(400, `${field} must be a number`)
  }
  if (number < minimum) {
    throw new HttpError(400, `${field} must be at least ${minimum}`)
  }
  return number
}

const ensureBoolean = (value: unknown, field: string) => {
  if (typeof value !== 'boolean') throw new HttpError(400, `${field} must be a boolean`)
  return value
}

const normalizeFreightDimensions = (value: unknown) => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new HttpError(400, 'dimensions must be a non-empty array')
  }

  return value.map((dimension, index) => {
    if (!dimension || typeof dimension !== 'object' || Array.isArray(dimension)) {
      throw new HttpError(400, `dimensions[${index}] must be an object`)
    }
    const entry = dimension as Record<string, unknown>
    const boxCount = ensureNumber(entry.box_count, `dimensions[${index}].box_count`, 1)
    if (!Number.isInteger(boxCount)) {
      throw new HttpError(400, `dimensions[${index}].box_count must be an integer`)
    }
    return {
      ...entry,
      length_cm: ensureNumber(entry.length_cm, `dimensions[${index}].length_cm`, 0.01),
      width_cm: ensureNumber(entry.width_cm, `dimensions[${index}].width_cm`, 0.01),
      height_cm: ensureNumber(entry.height_cm, `dimensions[${index}].height_cm`, 0.01),
      box_count: boxCount,
    }
  })
}

const formValue = (value: unknown) => {
  if (typeof value === 'string') return value
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  return JSON.stringify(value)
}

const isUpload = (value: unknown): value is DelhiveryB2BUpload =>
  Boolean(
    value &&
      typeof value === 'object' &&
      Buffer.isBuffer((value as DelhiveryB2BUpload).buffer) &&
      (value as DelhiveryB2BUpload).originalname,
  )

export class DelhiveryB2BService {
  constructor(private readonly override?: CredentialsOverride) {}

  static clearTokenCache() {
    cachedToken = null
    loginInFlight = null
  }

  async getOperationalDefaults() {
    const credentials = await this.credentials()
    return {
      clientId: credentials.clientId,
      warehouseId: credentials.warehouseId,
      freightMode: credentials.freightMode,
      fmPickup: credentials.fmPickup,
    }
  }

  private async credentials(): Promise<DelhiveryB2BCredentials> {
    if (!this.override) return getDelhiveryB2BCredentials()
    return {
      apiBase: trimBaseUrl(this.override.apiBase),
      username: clean(this.override.username),
      password: clean(this.override.password),
      clientId: clean(this.override.clientId),
      warehouseId: clean(this.override.warehouseId),
      freightMode: this.override.freightMode === 'fod' ? 'fod' : 'fop',
      fmPickup: this.override.fmPickup ?? true,
    }
  }

  private async baseUrl() {
    const credentials = await this.credentials()
    return trimBaseUrl(credentials.apiBase)
  }

  private providerError(error: any, fallback: string): never {
    const status = Number(error?.response?.status || error?.statusCode || 502)
    const message = extractMessage(error?.response?.data) || clean(error?.message) || fallback
    throw new HttpError(status >= 400 && status < 600 ? status : 502, message)
  }

  async resetPassword(username?: string) {
    const credentials = await this.credentials()
    const accountUsername = ensureRequired(username || credentials.username, 'username')
    try {
      const response = await axios.post(
        `${trimBaseUrl(credentials.apiBase)}/forgot-password`,
        { username: accountUsername },
        { timeout: timeoutMs(), headers: { 'Content-Type': 'application/json' } },
      )
      return response.data
    } catch (error) {
      this.providerError(error, 'Delhivery B2B password reset request failed')
    }
  }

  async login(force = false): Promise<LoginResult> {
    const credentials = await this.credentials()
    const username = ensureRequired(credentials.username, 'username')
    const password = ensureRequired(credentials.password, 'password')
    const credentialKey = makeCredentialKey(credentials)

    if (
      !force &&
      cachedToken?.credentialKey === credentialKey &&
      cachedToken.expiresAt > Date.now() + 60_000
    ) {
      return { token: cachedToken.token, expiresAt: cachedToken.expiresAt, cached: true }
    }

    if (loginInFlight?.credentialKey === credentialKey) {
      return loginInFlight.promise
    }

    const promise: Promise<LoginResult> = (async () => {
      try {
        const response = await axios.post(
          `${trimBaseUrl(credentials.apiBase)}/ums/login`,
          { username, password },
          { timeout: timeoutMs(), headers: { 'Content-Type': 'application/json' } },
        )
        const token = tokenFromResponse(response.data)
        if (!token) throw new HttpError(502, 'Delhivery B2B login response did not contain a JWT')
        const expiresAt = parseJwtExpiry(token)
        cachedToken = { credentialKey, token, expiresAt }
        return { token, expiresAt, cached: false }
      } catch (error) {
        if (error instanceof HttpError) throw error
        this.providerError(error, 'Delhivery B2B login failed')
      }
    })()

    loginInFlight = { credentialKey, promise }
    try {
      return await promise
    } finally {
      if (loginInFlight?.promise === promise) loginInFlight = null
    }
  }

  async logout() {
    const credentials = await this.credentials()
    const { token } = await this.login()
    try {
      const response = await axios.get(`${trimBaseUrl(credentials.apiBase)}/ums/logout`, {
        timeout: timeoutMs(),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      cachedToken = null
      return response.data
    } catch (error) {
      this.providerError(error, 'Delhivery B2B logout failed')
    }
  }

  private async authorizedRequest<T = any>(
    config: AxiosRequestConfig,
    retryUnauthorized = true,
  ): Promise<T> {
    const baseURL = await this.baseUrl()
    const { token } = await this.login()
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      'X-Request-Id': randomUUID(),
    }
    if (!(config.data instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json'
    }
    try {
      const response: AxiosResponse<T> = await axios.request({
        baseURL,
        timeout: timeoutMs(),
        ...config,
        headers: {
          ...defaultHeaders,
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      if (retryUnauthorized && error?.response?.status === 401) {
        cachedToken = null
        await this.login(true)
        return this.authorizedRequest<T>(config, false)
      }
      this.providerError(error, 'Delhivery B2B request failed')
    }
  }

  private toMultipart(payload: Record<string, unknown>) {
    const form = new FormData()
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null || value === '') continue
      if (Array.isArray(value) && value.length === 0) continue

      if (isUpload(value)) {
        form.append(
          key,
          new Blob([value.buffer as any], { type: value.mimetype || 'application/octet-stream' }),
          value.originalname,
        )
        continue
      }

      if (Array.isArray(value) && value.every(isUpload)) {
        for (const upload of value) {
          form.append(
            key,
            new Blob([upload.buffer as any], {
              type: upload.mimetype || 'application/octet-stream',
            }),
            upload.originalname,
          )
        }
        continue
      }

      form.append(key, formValue(value))
    }
    return form
  }

  async checkServiceability(pincode: string, weight?: number) {
    const pin = ensurePincode(pincode)
    const normalizedWeight = optionalWeightGrams(weight)
    return this.authorizedRequest({
      method: 'GET',
      url: `/pincode-service/${encodeURIComponent(pin)}`,
      params: normalizedWeight === undefined ? undefined : { weight: normalizedWeight },
    })
  }

  getExpectedTat(originPin: string, destinationPin: string) {
    return this.authorizedRequest({
      method: 'GET',
      url: '/tat/estimate',
      params: {
        origin_pin: ensurePincode(originPin, 'origin_pin'),
        destination_pin: ensurePincode(destinationPin, 'destination_pin'),
      },
    })
  }

  async estimateFreight(payload: Record<string, unknown>) {
    const paymentMode = clean(payload.payment_mode).toLowerCase()
    if (!['cod', 'prepaid'].includes(paymentMode)) {
      throw new HttpError(400, 'payment_mode must be either cod or prepaid')
    }

    const requestedFreightMode = clean(payload.freight_mode).toLowerCase()
    if (requestedFreightMode && !['fop', 'fod'].includes(requestedFreightMode)) {
      throw new HttpError(400, 'freight_mode must be either fop or fod')
    }
    const freightMode = requestedFreightMode || (await this.credentials()).freightMode

    const data: Record<string, unknown> = {
      ...payload,
      dimensions: normalizeFreightDimensions(payload.dimensions),
      weight_g: ensureNumber(payload.weight_g, 'weight_g', 0.01),
      source_pin: ensurePincode(payload.source_pin, 'source_pin'),
      consignee_pin: ensurePincode(payload.consignee_pin, 'consignee_pin'),
      payment_mode: paymentMode,
      inv_amount: ensureNumber(payload.inv_amount, 'inv_amount'),
      freight_mode: freightMode,
    }

    if (payload.cheque_payment !== undefined) {
      data.cheque_payment = ensureBoolean(payload.cheque_payment, 'cheque_payment')
    }
    if (payload.rov_insurance !== undefined) {
      data.rov_insurance = ensureBoolean(payload.rov_insurance, 'rov_insurance')
    }
    if (paymentMode === 'cod') {
      data.cod_amount = ensureNumber(payload.cod_amount, 'cod_amount')
    } else if (payload.cod_amount !== undefined) {
      data.cod_amount = ensureNumber(payload.cod_amount, 'cod_amount')
    }

    return this.authorizedRequest({ method: 'POST', url: '/freight/estimate', data })
  }

  getFreightCharges(lrns: string[] | string) {
    const values = (Array.isArray(lrns) ? lrns : clean(lrns).split(','))
      .map(clean)
      .filter(Boolean)
    if (values.length > 25) throw new HttpError(400, 'A maximum of 25 LRNs is allowed')
    const value = values.join(',')
    ensureRequired(value, 'lrns')
    return this.authorizedRequest({
      method: 'GET',
      url: `/lrn/freight-breakup/lrns=${encodeURIComponent(value)}`,
    })
  }

  createWarehouse(payload: Record<string, unknown>) {
    return this.authorizedRequest({
      method: 'POST',
      url: '/client-warehouse/create/',
      data: payload,
    })
  }

  updateWarehouse(payload: Record<string, unknown>) {
    return this.authorizedRequest({
      method: 'PATCH',
      url: '/client-warehouses/update',
      data: payload,
    })
  }

  manifestShipment(payload: Record<string, unknown>) {
    return this.authorizedRequest({
      method: 'POST',
      url: '/manifest',
      data: this.toMultipart(payload),
    })
  }

  getManifestStatus(jobId: string) {
    return this.authorizedRequest({
      method: 'GET',
      url: '/manifest',
      params: { job_id: ensureRequired(jobId, 'job_id') },
    })
  }

  updateShipment(lrn: string, payload: Record<string, unknown>) {
    return this.authorizedRequest({
      method: 'PUT',
      url: `/lrn/update/${encodeURIComponent(ensureRequired(lrn, 'lrn'))}`,
      data: this.toMultipart(payload),
    })
  }

  getShipmentUpdateStatus(jobId: string) {
    return this.authorizedRequest({
      method: 'GET',
      url: '/lrn/update/status',
      params: { job_id: ensureRequired(jobId, 'job_id') },
    })
  }

  cancelShipment(lrn: string) {
    return this.authorizedRequest({
      method: 'DELETE',
      url: `/lrn/cancel/${encodeURIComponent(ensureRequired(lrn, 'lrn'))}`,
    })
  }

  trackShipment(lrn: string, allWaybills = false) {
    return this.authorizedRequest({
      method: 'GET',
      url: '/lrn/track',
      params: { lrnum: ensureRequired(lrn, 'lrn'), all_wbns: allWaybills },
    })
  }

  bookLastMileAppointment(payload: Record<string, unknown>) {
    return this.authorizedRequest({ method: 'POST', url: '/v2/appointments/lm', data: payload })
  }

  createPickupRequest(payload: Record<string, unknown>) {
    return this.authorizedRequest({ method: 'POST', url: '/pickup_requests', data: payload })
  }

  cancelPickupRequest(pickupId: string) {
    return this.authorizedRequest({
      method: 'DELETE',
      url: `/pickup_requests/${encodeURIComponent(ensureRequired(pickupId, 'pickup_id'))}`,
    })
  }

  getShippingLabel(lrn: string, size = 'std') {
    const normalizedSize = clean(size).toLowerCase()
    if (!['sm', 'md', 'a4', 'std'].includes(normalizedSize)) {
      throw new HttpError(400, 'size must be one of sm, md, a4, or std')
    }
    return this.authorizedRequest({
      method: 'GET',
      url: `/label/get_urls/${normalizedSize}/${encodeURIComponent(ensureRequired(lrn, 'lrn'))}`,
    })
  }

  getLrCopy(lrn: string, lrCopyType?: string | string[]) {
    return this.authorizedRequest({
      method: 'GET',
      url: `/lr_copy/print/${encodeURIComponent(ensureRequired(lrn, 'lrn'))}`,
      params: lrCopyType
        ? { lr_copy_type: Array.isArray(lrCopyType) ? lrCopyType.join(',') : lrCopyType }
        : undefined,
    })
  }

  generateDocument(docType: 'shipping_label' | 'lr_copy', payload: Record<string, unknown>) {
    return this.authorizedRequest({
      method: 'POST',
      url: `/generate/${docType}`,
      data: payload,
    })
  }

  getGenerateDocumentStatus(docType: 'shipping_label' | 'lr_copy', jobId: string) {
    return this.authorizedRequest({
      method: 'GET',
      url: `/generate/${docType}/status/${encodeURIComponent(ensureRequired(jobId, 'job_id'))}`,
    })
  }

  downloadDocument(params: Record<string, unknown>) {
    return this.authorizedRequest({ method: 'GET', url: '/document/download', params })
  }
}
