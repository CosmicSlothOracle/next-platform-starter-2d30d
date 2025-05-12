import { Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const store = getStore('images')

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { image, name } = JSON.parse(event.body || '{}')
    if (!image || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Image and name are required' })
      }
    }

    // Store image in Netlify Blobs
    const key = `banner-${Date.now()}-${name}`
    await store.set(key, image, {
      metadata: {
        uploadedAt: new Date().toISOString(),
        type: 'banner'
      }
    })

    // Get the URL for the stored image
    const url = await store.getUrl(key)

    return {
      statusCode: 200,
      body: JSON.stringify({ url, key })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload image' })
    }
  }
}