import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

// Force dynamic so Next.js does not statically cache the database contents at build time
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await readDb()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error: any) {
    console.error('Portfolio read failed:', error)
    return NextResponse.json({ error: 'Portfolio content is temporarily unavailable.' }, { status: 500 })
  }
}

