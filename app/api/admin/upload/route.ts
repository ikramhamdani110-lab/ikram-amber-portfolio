import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true })

    const ext = path.extname(file.name)
    const sanitizedName = file.name
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 30)
    
    const fileName = `${Date.now()}-${sanitizedName}${ext}`

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${fileName}`, buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: file.type || 'application/octet-stream',
      })
      return NextResponse.json({ success: true, path: blob.url })
    }

    const filePath = path.join(uploadDir, fileName)

    await fs.writeFile(filePath, buffer)

    return NextResponse.json({ success: true, path: `/uploads/${fileName}` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

