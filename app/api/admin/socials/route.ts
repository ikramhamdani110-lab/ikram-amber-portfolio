import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { github, linkedin, email, fiverr } = await req.json()
    const db = await readDb()

    if (github !== undefined) db.socials.github = github
    if (linkedin !== undefined) db.socials.linkedin = linkedin
    if (email !== undefined) db.socials.email = email
    if (fiverr !== undefined) db.socials.fiverr = fiverr

    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist social changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, data: db.socials })
  } catch (error: any) {
    console.error('Social save failed:', error)
    return NextResponse.json({ error: 'Social changes could not be saved.' }, { status: 500 })
  }
}
