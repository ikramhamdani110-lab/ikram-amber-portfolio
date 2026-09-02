import { NextResponse } from 'next/server'
import { setSessionCookie } from '@/lib/auth'
import {
  clearVerificationAttempts,
  getVerificationAttemptState,
  readAuthState,
  registerFailedVerificationAttempt,
  verifyPassword,
  hashPassword,
  writeAuthState,
} from '@/lib/security'

const LOGIN_RATE_LIMIT_KEY = 'admin:login'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()

    const attemptState = getVerificationAttemptState(LOGIN_RATE_LIMIT_KEY)
    if (attemptState.blocked) {
      return NextResponse.json({ error: 'Too many failed sign-in attempts. Please wait a moment and try again.' }, { status: 429 })
    }

    const state = readAuthState()
    const configuredPassword = process.env.ADMIN_PASSWORD

    if (configuredPassword && password === configuredPassword && !verifyPassword(password, state.passwordHash, state.passwordSalt)) {
      const nextPassword = hashPassword(configuredPassword)
      state.passwordHash = nextPassword.hash
      state.passwordSalt = nextPassword.salt
      // Serverless filesystems can be read-only; never fail login because of a sync attempt.
      try {
        writeAuthState(state)
      } catch (writeError) {
        console.warn('Auth state sync skipped (read-only filesystem)')
      }
    }

    if (password && verifyPassword(password, state.passwordHash, state.passwordSalt)) {
      clearVerificationAttempts(LOGIN_RATE_LIMIT_KEY)
      await setSessionCookie('admin')
      return NextResponse.json({ success: true })
    }

    if (password) {
      registerFailedVerificationAttempt(LOGIN_RATE_LIMIT_KEY)
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error: any) {
    console.error('Login failed:', error)
    return NextResponse.json({ error: 'Sign-in could not be completed.' }, { status: 500 })
  }
}

