import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, description, dbTextBadge, aboutSkills, groups, sectionLabel } = await req.json()
    const db = await readDb()

    if (title !== undefined) db.skills.title = title
    if (description !== undefined) db.skills.description = description
    if (dbTextBadge !== undefined) db.skills.dbTextBadge = dbTextBadge
    if (aboutSkills !== undefined) db.skills.aboutSkills = aboutSkills
    if (groups !== undefined) db.skills.groups = groups
    if (sectionLabel !== undefined) db.skills.sectionLabel = sectionLabel

    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist skills changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, data: db.skills })
  } catch (error: any) {
    console.error('Skills save failed:', error)
    return NextResponse.json({ error: 'Skills changes could not be saved.' }, { status: 500 })
  }
}

