import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { decryptPayload, generateRecoveryCodes, readAuthState, verifyTotpCode, writeAuthState, encryptPayload } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await req.json()
    const state = readAuthState()
    const secret = decryptPayload(state.pendingTotpSecretEncrypted || '')

    if (!secret || !verifyTotpCode(secret, String(code), Date.now())) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 401 })
    }

    const recoveryCodes = generateRecoveryCodes(8)
    state.totpSecretEncrypted = encryptPayload(secret)
    state.pendingTotpSecretEncrypted = undefined
    state.verificationEnabled = true
    state.recoveryCodesEncrypted = encryptPayload(JSON.stringify(recoveryCodes))
    state.pendingSetupAt = undefined
    state.lastSetupAt = Date.now()
    writeAuthState(state)

    return NextResponse.json({ success: true, recoveryCodes })
  } catch (error: any) {
    console.error('TOTP confirmation failed:', error)
    return NextResponse.json({ error: 'Verification could not be completed.' }, { status: 500 })
  }
}
