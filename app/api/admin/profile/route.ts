import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { hero, about, socials, connect, siteSettings, certificationsSettings, updatesSettings } = await req.json()
    const db = await readDb()

    if (hero) db.hero = { ...db.hero, ...hero }
    if (about) db.about = { ...db.about, ...about }
    if (socials) db.socials = { ...db.socials, ...socials }
    if (connect) db.connect = { ...db.connect, ...connect }
    if (siteSettings) db.siteSettings = { ...db.siteSettings, ...siteSettings }
    if (certificationsSettings) db.certificationsSettings = { ...db.certificationsSettings, ...certificationsSettings }
    if (updatesSettings) db.updatesSettings = { ...db.updatesSettings, ...updatesSettings }

    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist profile changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, data: db })
  } catch (error: any) {
    console.error('Profile save failed:', error)
    return NextResponse.json({ error: 'Profile changes could not be saved.' }, { status: 500 })
  }
}

