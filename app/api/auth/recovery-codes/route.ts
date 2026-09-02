import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { decryptPayload, generateRecoveryCodes, readAuthState, writeAuthState, encryptPayload } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const state = readAuthState()
    const secret = decryptPayload(state.totpSecretEncrypted || '')

    if (!secret || !state.verificationEnabled) {
      return NextResponse.json({ error: 'Verification is not active.' }, { status: 400 })
    }

    const recoveryCodes = generateRecoveryCodes(8)
    state.recoveryCodesEncrypted = encryptPayload(JSON.stringify(recoveryCodes))
    writeAuthState(state)

    return NextResponse.json({ success: true, recoveryCodes })
  } catch (error: any) {
    console.error('Recovery code request failed:', error)
    return NextResponse.json({ error: 'Recovery codes could not be generated.' }, { status: 500 })
  }
}
