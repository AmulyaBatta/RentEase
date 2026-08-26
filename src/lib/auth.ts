import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-super-secret-key-1234567890'
)

const ALG = 'HS256'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { id: string; email: string; role: string; name: string }
  } catch (error) {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
