import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readAuthState } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const state = readAuthState()
    return NextResponse.json({
      verificationEnabled: Boolean(state.verificationEnabled),
      hasRecoveryCodes: Boolean(state.recoveryCodesEncrypted),
    })
  } catch (error: any) {
    console.error('Security status request failed:', error)
    return NextResponse.json({ error: 'Security status is unavailable.' }, { status: 500 })
  }
}
