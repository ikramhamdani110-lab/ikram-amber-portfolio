import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { hero, about, socials, connect, siteSettings } = await req.json()
    console.info('[admin/profile] save request received', {
      hasHero: Boolean(hero),
      hasAbout: Boolean(about),
      hasSocials: Boolean(socials),
      hasConnect: Boolean(connect),
      hasSiteSettings: Boolean(siteSettings),
    })
    const db = await readDb()

    if (hero) db.hero = { ...db.hero, ...hero }
    if (about) db.about = { ...db.about, ...about }
    if (socials) db.socials = { ...db.socials, ...socials }
    if (connect) db.connect = { ...db.connect, ...connect }
    if (siteSettings) db.siteSettings = { ...db.siteSettings, ...siteSettings }

    await writeDb(db)

    return NextResponse.json({ success: true, data: db })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

