import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Logout failed:', error)
    return NextResponse.json({ error: 'Sign-out could not be completed.' }, { status: 500 })
  }
}

