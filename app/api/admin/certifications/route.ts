import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb, type Certification } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = await readDb()
  return NextResponse.json(db.certifications || [])
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const certData = await req.json()
    const db = await readDb()
    if (!db.certifications) db.certifications = []

    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: certData.name || 'New Certification',
      organization: certData.organization || '',
      date: certData.date || '',
      credentialId: certData.credentialId || '',
      credentialUrl: certData.credentialUrl || '',
      image: certData.image || '',
      description: certData.description || '',
      visible: certData.visible !== undefined ? certData.visible : true,
      order: db.certifications.length
    }

    db.certifications.push(newCert)
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist certification changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, certification: newCert, certifications: db.certifications })
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
      db.certifications = body.map((c, index) => ({ ...c, order: index }))
      if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist certification changes. Check persistent storage configuration.' }, { status: 500 })
      return NextResponse.json({ success: true, certifications: db.certifications })
    }

    // Otherwise, treat it as a single certification update
    const { id, name, organization, date, credentialId, credentialUrl, image, description, visible } = body
    if (!id) {
      return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 })
    }

    const index = db.certifications.findIndex((c) => c.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 444 })
    }

    db.certifications[index] = {
      ...db.certifications[index],
      name: name !== undefined ? name : db.certifications[index].name,
      organization: organization !== undefined ? organization : db.certifications[index].organization,
      date: date !== undefined ? date : db.certifications[index].date,
      credentialId: credentialId !== undefined ? credentialId : db.certifications[index].credentialId,
      credentialUrl: credentialUrl !== undefined ? credentialUrl : db.certifications[index].credentialUrl,
      image: image !== undefined ? image : db.certifications[index].image,
      description: description !== undefined ? description : db.certifications[index].description,
      visible: visible !== undefined ? visible : db.certifications[index].visible,
    }

    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist certification changes. Check persistent storage configuration.' }, { status: 500 })
    return NextResponse.json({ success: true, certification: db.certifications[index], certifications: db.certifications })
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
      return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 })
    }

    const db = await readDb()
    db.certifications = db.certifications.filter((c) => c.id !== id)
    
    // Normalize order
    db.certifications = db.certifications.map((c, i) => ({ ...c, order: i }))
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist certification changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, certifications: db.certifications })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

