import { NextResponse } from 'next/server'
import { get } from '@vercel/blob'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  const pathname = new URL(req.url).searchParams.get('pathname')

  if (!token || !pathname || !pathname.startsWith('uploads/')) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  }

  try {
    const result = await get(pathname, {
      access: 'private',
      token,
      useCache: true,
    })

    if (!result) return NextResponse.json({ error: 'Media not found' }, { status: 404 })

    return new NextResponse(result.stream, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': result.blob.contentType,
      },
    })
  } catch (error) {
    console.error('Error reading private media:', error)
    return NextResponse.json({ error: 'Media unavailable' }, { status: 500 })
  }
}