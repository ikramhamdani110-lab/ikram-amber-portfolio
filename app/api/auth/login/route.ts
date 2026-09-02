import { NextResponse } from 'next/server'
import { setSessionCookie } from '@/lib/auth'
import { readAuthState, verifyPassword, hashPassword, writeAuthState } from '@/lib/security'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
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
      await setSessionCookie('admin')
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error: any) {
    console.error('Login failed:', error)
    return NextResponse.json({ error: 'Sign-in could not be completed.' }, { status: 500 })
  }
}

