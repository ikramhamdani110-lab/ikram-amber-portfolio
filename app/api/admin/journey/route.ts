import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, stages, ctaTitle, ctaButtonText, sectionLabel } = await req.json()
    const db = await readDb()

    if (title !== undefined) db.journey.title = title
    if (stages !== undefined) db.journey.stages = stages
    if (ctaTitle !== undefined) db.journey.ctaTitle = ctaTitle
    if (ctaButtonText !== undefined) db.journey.ctaButtonText = ctaButtonText
    if (sectionLabel !== undefined) db.journey.sectionLabel = sectionLabel

    await writeDb(db)

    return NextResponse.json({ success: true, data: db.journey })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

