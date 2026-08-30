import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, stages, ctaTitle, ctaButtonText } = await req.json()
    const db = readDb()

    if (title !== undefined) db.journey.title = title
    if (stages !== undefined) db.journey.stages = stages
    if (ctaTitle !== undefined) db.journey.ctaTitle = ctaTitle
    if (ctaButtonText !== undefined) db.journey.ctaButtonText = ctaButtonText

    const success = writeDb(db)
    if (!success) {
      return NextResponse.json({ error: 'Failed to write to database' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: db.journey })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

