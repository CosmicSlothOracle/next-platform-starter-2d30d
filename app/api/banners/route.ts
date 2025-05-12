import { NextResponse } from 'next/server'
import { getStore } from '@netlify/blobs'

const store = getStore('banners')

export async function GET() {
  try {
    const banners = await store.list()
    const bannerUrls = await Promise.all(
      banners.blobs.map(async (blob) => {
        const url = await store.getUrl(blob.key)
        return {
          key: blob.key,
          url,
          metadata: blob.metadata
        }
      })
    )

    return NextResponse.json({ banners: bannerUrls })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { url, metadata } = data

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const key = `banner-${Date.now()}`
    await store.set(key, url, {
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString()
      }
    })

    const storedUrl = await store.getUrl(key)

    return NextResponse.json({
      key,
      url: storedUrl,
      metadata
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Banner key is required' },
        { status: 400 }
      )
    }

    await store.delete(key)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    )
  }
}