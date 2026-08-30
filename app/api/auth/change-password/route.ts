import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  clearVerificationAttempts,
  decryptPayload,
  ensurePasswordIsStrong,
  getVerificationAttemptState,
  readAuthState,
  registerFailedVerificationAttempt,
  verifyPassword,
  verifyTotpCode,
  writeAuthState,
  hashPassword,
} from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword, verificationCode } = await req.json()
    const state = readAuthState()
    const verificationKey = `admin:${session.username}`

    const attemptState = getVerificationAttemptState(verificationKey)
    if (attemptState.blocked) {
      return NextResponse.json({ error: 'Too many failed verification attempts. Please wait a moment and try again.' }, { status: 429 })
    }

    if (!currentPassword || !newPassword || !verificationCode) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const secret = decryptPayload(state.totpSecretEncrypted || '')
    if (!state.verificationEnabled || !secret) {
      return NextResponse.json({ error: 'Verification is not enabled for this account.' }, { status: 403 })
    }

    if (!verifyPassword(currentPassword, state.passwordHash, state.passwordSalt)) {
      registerFailedVerificationAttempt(verificationKey)
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })
    }

    if (!verifyTotpCode(secret, String(verificationCode), Date.now())) {
      registerFailedVerificationAttempt(verificationKey)
      return NextResponse.json({ error: 'Verification code is invalid or expired.' }, { status: 401 })
    }

    if (!ensurePasswordIsStrong(newPassword)) {
      return NextResponse.json({ error: 'Password does not meet the required security requirements.' }, { status: 400 })
    }

    const next = hashPassword(newPassword)
    state.passwordHash = next.hash
    state.passwordSalt = next.salt
    writeAuthState(state)
    clearVerificationAttempts(verificationKey)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
