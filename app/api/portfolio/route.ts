import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

// Force dynamic so Next.js does not statically cache the database contents at build time
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = readDb()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

