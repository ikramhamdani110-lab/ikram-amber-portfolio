import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, description, dbTextBadge, aboutSkills, groups } = await req.json()
    const db = readDb()

    if (title !== undefined) db.skills.title = title
    if (description !== undefined) db.skills.description = description
    if (dbTextBadge !== undefined) db.skills.dbTextBadge = dbTextBadge
    if (aboutSkills !== undefined) db.skills.aboutSkills = aboutSkills
    if (groups !== undefined) db.skills.groups = groups

    const success = writeDb(db)
    if (!success) {
      return NextResponse.json({ error: 'Failed to write to database' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: db.skills })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

