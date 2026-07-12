import * as dotenv from 'dotenv'
import path from 'path'
import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../models/client'
import { users } from '../models/schema/users'
import { userProfiles } from '../models/schema/userProfile'

const env = process.env.NODE_ENV || 'development'
dotenv.config({ path: path.resolve(__dirname, `../../.env.${env}`) })

const email = (process.env.ADMIN_SEED_EMAIL || process.env.ADMIN_LOGIN_EMAIL || 'admin@shiplifi.com')
  .trim()
  .toLowerCase()
const password = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_LOGIN_PASSWORD || 'Admin@12345!'

async function ensureAdmin() {
  if (!email || !password) {
    throw new Error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required')
  }

  const passwordHash = await bcryptjs.hash(password, 10)
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  let userId = existingUser?.id

  if (existingUser) {
    await db
      .update(users)
      .set({
        passwordHash,
        role: 'admin',
        emailVerified: true,
        phoneVerified: true,
        accountVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
    console.log(`Admin updated: ${email}`)
  } else {
    const [createdUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        role: 'admin',
        emailVerified: true,
        phoneVerified: true,
        accountVerified: true,
      })
      .returning()

    userId = createdUser.id
    console.log(`Admin created: ${email}`)
  }

  const existingProfile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId!),
  })

  const companyInfo = {
    businessName: 'Express Magic Admin',
    contactPerson: 'Admin User',
    POCEmailVerified: true,
    POCPhoneVerified: true,
    companyAddress: 'Admin Workspace',
    pincode: '110001',
    state: 'Delhi',
    city: 'New Delhi',
    contactNumber: '+919999999999',
    contactEmail: email,
    companyContactNumber: '+919999999999',
    brandName: 'Express Magic',
    companyEmail: email,
    website: 'https://express-magic-production.up.railway.app',
  }

  if (existingProfile) {
    await db
      .update(userProfiles)
      .set({
        companyInfo,
        businessType: ['b2c'],
        approved: true,
        onboardingComplete: true,
        profileComplete: true,
        approvedAt: existingProfile.approvedAt ?? new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId!))
    console.log('Admin profile updated')
  } else {
    await db.insert(userProfiles).values({
      userId: userId!,
      companyInfo,
      businessType: ['b2c'],
      approved: true,
      onboardingComplete: true,
      profileComplete: true,
      approvedAt: new Date(),
    })
    console.log('Admin profile created')
  }

  console.log('\nAdmin panel login')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
}

ensureAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to ensure admin:', error)
    process.exit(1)
  })
