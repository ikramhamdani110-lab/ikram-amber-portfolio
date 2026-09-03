import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readDb, writeDb, type Project } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = await readDb()
  return NextResponse.json(db.projects || [])
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const db = await readDb()
    if (!db.projects) db.projects = []

    const maxOrder = db.projects.reduce((max, p) => Math.max(max, p.order || 0), 0)

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: data.title || 'New Project',
      description: data.description || '',
      category: data.category || 'Web',
      image: data.image || '',
      additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      demoUrl: data.demoUrl || '',
      sourceUrl: data.sourceUrl || '',
      visible: data.visible !== undefined ? data.visible : true,
      order: maxOrder + 1,
    }

    db.projects.push(newProject)
    db.projects.sort((a, b) => (a.order || 0) - (b.order || 0))
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist project changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, project: newProject, projects: db.projects })
  } catch (error: unknown) {
    console.error('Project create failed:', error)
    return NextResponse.json({ error: 'Project could not be saved.' }, { status: 500 })
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
    if (!db.projects) db.projects = []

    // Bulk update / reorder — merge by id so partial payloads never wipe fields
    if (Array.isArray(body)) {
      db.projects = (body as Project[])
        .map((incoming) => {
          const existing = db.projects.find((p) => p.id === incoming.id)
          if (!existing) return incoming
          return { ...existing, ...incoming }
        })
      if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist project changes. Check persistent storage configuration.' }, { status: 500 })
      return NextResponse.json({ success: true, projects: db.projects })
    }

    const { id, title, description, category, image, additionalImages, tags, demoUrl, sourceUrl, visible, order } = body
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const index = db.projects.findIndex((p) => p.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    db.projects[index] = {
      ...db.projects[index],
      title: title !== undefined ? title : db.projects[index].title,
      description: description !== undefined ? description : db.projects[index].description,
      category: category !== undefined ? category : db.projects[index].category,
      image: image !== undefined ? image : db.projects[index].image,
      additionalImages: Array.isArray(additionalImages) ? additionalImages : db.projects[index].additionalImages,
      tags: Array.isArray(tags) ? tags : db.projects[index].tags,
      demoUrl: demoUrl !== undefined ? demoUrl : db.projects[index].demoUrl,
      sourceUrl: sourceUrl !== undefined ? sourceUrl : db.projects[index].sourceUrl,
      visible: visible !== undefined ? visible : db.projects[index].visible,
      order: order !== undefined ? order : db.projects[index].order,
    }

    db.projects.sort((a, b) => (a.order || 0) - (b.order || 0))
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist project changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, project: db.projects[index], projects: db.projects })
  } catch (error: unknown) {
    console.error('Project save failed:', error)
    return NextResponse.json({ error: 'Project could not be saved.' }, { status: 500 })
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
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const db = await readDb()
    if (!db.projects) db.projects = []
    db.projects = db.projects.filter((p) => p.id !== id)
    if (!await writeDb(db)) return NextResponse.json({ error: 'Could not persist project changes. Check persistent storage configuration.' }, { status: 500 })

    return NextResponse.json({ success: true, projects: db.projects })
  } catch (error: unknown) {
    console.error('Project delete failed:', error)
    return NextResponse.json({ error: 'Project could not be deleted.' }, { status: 500 })
  }
}
