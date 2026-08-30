import crypto from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'admin_session'
const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-secret-key-please-change-in-production-123456789'

export interface UserSession {
  username: string
  exp: number
}

// Native JWT signing using standard HMAC SHA256
export function signToken(payload: UserSession): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64url')
    
  return `${header}.${body}.${signature}`
}

// Native JWT verification
export function verifyToken(token: string): UserSession | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const [header, body, signature] = parts
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${body}`)
      .digest('base64url')
      
    if (signature !== expectedSignature) return null
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as UserSession
    if (payload.exp && Date.now() > payload.exp) return null
    
    return payload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Helper to authenticate requests in Route Handlers
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    if (!sessionCookie || !sessionCookie.value) return null
    
    return verifyToken(sessionCookie.value)
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

// Set session cookie
export async function setSessionCookie(username: string) {
  const cookieStore = await cookies()
  const exp = Date.now() + 24 * 60 * 60 * 1000 // 1 day
  const token = signToken({ username, exp })
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day
  })
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

