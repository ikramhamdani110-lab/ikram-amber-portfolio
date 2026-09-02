import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb, type PortfolioUpdate } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = await readDb()
  return NextResponse.json(db.updates || [])
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const db = await readDb()
    if (!db.updates) db.updates = []

    const newUpdate: PortfolioUpdate = {
      id: `update-${Date.now()}`,
      title: data.title || 'New Update',
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      image: data.image || '',
      visible: data.visible !== undefined ? data.visible : true,
      category: data.category || 'update'
    }

    db.updates.push(newUpdate)
    // Sort updates by date descending by default
    db.updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist update changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, update: newUpdate, updates: db.updates })
  } catch (error: any) {
    console.error('Update create failed:', error)
    return NextResponse.json({ error: 'Update could not be saved.' }, { status: 500 })
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

    // Bulk update/reorder list
    if (Array.isArray(body)) {
      db.updates = body
      if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist update changes. Check persistent storage configuration.' }, { status: 500 })
      return NextResponse.json({ success: true, updates: db.updates })
    }

    const { id, title, description, date, image, visible, category } = body
    if (!id) {
      return NextResponse.json({ error: 'Update ID is required' }, { status: 400 })
    }

    const index = db.updates.findIndex((u) => u.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 })
    }

    db.updates[index] = {
      ...db.updates[index],
      title: title !== undefined ? title : db.updates[index].title,
      description: description !== undefined ? description : db.updates[index].description,
      date: date !== undefined ? date : db.updates[index].date,
      image: image !== undefined ? image : db.updates[index].image,
      visible: visible !== undefined ? visible : db.updates[index].visible,
      category: category !== undefined ? category : db.updates[index].category,
    }

    // Sort by date descending
    db.updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist update changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, update: db.updates[index], updates: db.updates })
  } catch (error: any) {
    console.error('Update save failed:', error)
    return NextResponse.json({ error: 'Update could not be saved.' }, { status: 500 })
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
      return NextResponse.json({ error: 'Update ID is required' }, { status: 400 })
    }

    const db = await readDb()
    db.updates = db.updates.filter((u) => u.id !== id)
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist update changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, updates: db.updates })
  } catch (error: any) {
    console.error('Update delete failed:', error)
    return NextResponse.json({ error: 'Update could not be deleted.' }, { status: 500 })
  }
}

