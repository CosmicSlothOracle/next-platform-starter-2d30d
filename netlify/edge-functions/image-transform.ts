import { Context } from '@netlify/edge-functions'
import { getStore } from '@netlify/blobs'

export default async (request: Request, context: Context) => {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  const width = parseInt(url.searchParams.get('width') || '800')
  const height = parseInt(url.searchParams.get('height') || '600')
  const format = url.searchParams.get('format') || 'webp'

  if (!key) {
    return new Response('Image key is required', { status: 400 })
  }

  try {
    const store = getStore('images')
    const image = await store.get(key)

    if (!image) {
      return new Response('Image not found', { status: 404 })
    }

    // Transform image using sharp (in production you'd want to use Netlify's Image CDN)
    const transformedImage = await fetch(image.toString())
      .then(res => res.arrayBuffer())
      .then(buffer =>
        context.transformImage(buffer, {
          width,
          height,
          format
        })
      )

    return new Response(transformedImage, {
      headers: {
        'Content-Type': `image/${format}`,
        'Cache-Control': 'public, max-age=31536000'
      }
    })
  } catch (error) {
    return new Response('Error processing image', { status: 500 })
  }
}