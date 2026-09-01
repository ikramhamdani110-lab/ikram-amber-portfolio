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

    await writeDb(db)

    return NextResponse.json({ success: true, data: db.socials })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
