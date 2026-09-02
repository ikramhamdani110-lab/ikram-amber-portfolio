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

    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist journey changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, data: db.journey })
  } catch (error: any) {
    console.error('Journey save failed:', error)
    return NextResponse.json({ error: 'Journey changes could not be saved.' }, { status: 500 })
  }
}

