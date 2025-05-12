import { Handler } from '@netlify/functions'
import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'POST') {
    try {
      const { username, password } = JSON.parse(event.body || '{}')

      // Replace with your actual admin credentials check
      if (username === 'admin' && password === 'kosge2024!') {
        const token = await new SignJWT({ username })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('2h')
          .sign(SECRET_KEY)

        return {
          statusCode: 200,
          body: JSON.stringify({ token })
        }
      }

      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Authentication failed' })
      }
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const token = event.headers.authorization?.replace('Bearer ', '')
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'No token provided' })
        }
      }

      const { payload } = await jwtVerify(token, SECRET_KEY)
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true, user: payload })
      }
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token' })
      }
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}