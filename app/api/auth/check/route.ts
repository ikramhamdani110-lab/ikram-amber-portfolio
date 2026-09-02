import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    return NextResponse.json({ authenticated: !!session })
  } catch (error: any) {
    console.error('Auth status check failed:', error)
    return NextResponse.json({ error: 'Authentication status is unavailable.' }, { status: 500 })
  }
}

