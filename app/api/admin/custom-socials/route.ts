import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb, type CustomSocialLink } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = await readDb()
  return NextResponse.json(db.customSocialLinks || [])
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const linkData = await req.json()
    const db = await readDb()
    if (!db.customSocialLinks) db.customSocialLinks = []

    const newLink: CustomSocialLink = {
      id: `social-${Date.now()}`,
      name: linkData.name || 'New Link',
      url: linkData.url || '',
      icon: linkData.icon || '',
      order: db.customSocialLinks.length
    }

    db.customSocialLinks.push(newLink)
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist social link changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, link: newLink, links: db.customSocialLinks })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const db = await readDb()

    // If body is an array, treat it as a bulk reorder operation
    if (Array.isArray(body)) {
      db.customSocialLinks = body.map((l, index) => ({ ...l, order: index }))
      if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist social link changes. Check persistent storage configuration.' }, { status: 500 })
      return NextResponse.json({ success: true, links: db.customSocialLinks })
    }

    // Otherwise, treat it as a single link update
    const { id, name, url, icon } = body
    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    const index = db.customSocialLinks.findIndex((l) => l.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    db.customSocialLinks[index] = {
      ...db.customSocialLinks[index],
      name: name !== undefined ? name : db.customSocialLinks[index].name,
      url: url !== undefined ? url : db.customSocialLinks[index].url,
      icon: icon !== undefined ? icon : db.customSocialLinks[index].icon,
    }

    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist social link changes. Check persistent storage configuration.' }, { status: 500 })
    return NextResponse.json({ success: true, link: db.customSocialLinks[index], links: db.customSocialLinks })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    const db = await readDb()
    db.customSocialLinks = db.customSocialLinks.filter((l) => l.id !== id)
    
    // Normalize order
    db.customSocialLinks = db.customSocialLinks.map((l, i) => ({ ...l, order: i }))
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist social link changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, links: db.customSocialLinks })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
