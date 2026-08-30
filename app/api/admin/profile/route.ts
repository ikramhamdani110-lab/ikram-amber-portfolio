import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { hero, about, socials, siteSettings } = await req.json()
    const db = readDb()

    if (hero) db.hero = { ...db.hero, ...hero }
    if (about) db.about = { ...db.about, ...about }
    if (socials) db.socials = { ...db.socials, ...socials }
    if (siteSettings) db.siteSettings = { ...db.siteSettings, ...siteSettings }

    const success = writeDb(db)
    if (!success) {
      return NextResponse.json({ error: 'Failed to write to database' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: db })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

