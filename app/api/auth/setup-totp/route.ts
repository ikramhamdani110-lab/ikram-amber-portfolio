import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateTotpSecret, getTotpAuthUrl, readAuthState, writeAuthState, encryptPayload } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const state = readAuthState()
    const secret = generateTotpSecret()
    state.pendingTotpSecretEncrypted = encryptPayload(secret)
    state.pendingSetupAt = Date.now()
    writeAuthState(state)

    const otpauthUrl = getTotpAuthUrl(secret, 'Ikram Admin', 'Ikram Portfolio Admin')
    return NextResponse.json({ otpauthUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
