import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

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

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }, { status: 415 })
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Image must be 5 MB or smaller' }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const ext = file.type === 'image/jpeg' ? '.jpg' : `.${file.type.split('/')[1]}`
    const sanitizedName = file.name
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 30)
    
    const fileName = `${Date.now()}-${sanitizedName}${ext}`

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${fileName}`, buffer, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: file.type || 'application/octet-stream',
      })
      return NextResponse.json({ success: true, path: `/api/media?pathname=${encodeURIComponent(blob.pathname)}` })
    }

    await fs.mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, fileName)

    await fs.writeFile(filePath, buffer)

    return NextResponse.json({ success: true, path: `/uploads/${fileName}` })
  } catch (error: any) {
    console.error('Media upload failed:', error)
    return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 })
  }
}

