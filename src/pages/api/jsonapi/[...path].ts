import type { APIRoute } from 'astro'
import { getSessionFromRequest, cleanupSessions } from '@/lib/puck-auth'

const DRUPAL_URL = import.meta.env.DRUPAL_BASE_URL
const CLIENT_ID = import.meta.env.DRUPAL_WRITE_CLIENT_ID || import.meta.env.DRUPAL_CLIENT_ID
const CLIENT_SECRET = import.meta.env.DRUPAL_WRITE_CLIENT_SECRET || import.meta.env.DRUPAL_CLIENT_SECRET

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const response = await fetch(`${DRUPAL_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  })

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return accessToken!
}

async function handleRequest(request: Request, path: string, method: string) {
  try {
    if (!DRUPAL_URL) {
      return new Response(JSON.stringify({ error: 'Drupal URL not configured' }), { status: 500 })
    }

    // Write operations require a valid Puck session.
    if (method !== 'GET') {
      cleanupSessions()
      const session = getSessionFromRequest(request)
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized. Please open the editor from Drupal.' }),
          { status: 401 }
        )
      }
    }

    const token = await getAccessToken()
    const url = new URL(request.url)
    const drupalUrl = `${DRUPAL_URL}/jsonapi/${path}${url.search}`

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.api+json',
    }

    let body: string | undefined
    if (method === 'POST' || method === 'PATCH') {
      headers['Content-Type'] = 'application/vnd.api+json'
      body = await request.text()
    }

    const drupalResponse = await fetch(drupalUrl, {
      method,
      headers,
      body,
      signal: AbortSignal.timeout(30000),
    })

    if (drupalResponse.status === 204) {
      return new Response(null, { status: 204 })
    }

    const responseData = await drupalResponse.json()
    return new Response(JSON.stringify(responseData), { status: drupalResponse.status })
  } catch (error: any) {
    console.error('JSON:API proxy error:', error)
    return new Response(
      JSON.stringify({ error: `JSON:API proxy error: ${error.message}` }),
      { status: 502 }
    )
  }
}

export const GET: APIRoute = async ({ params, request }) => {
  return handleRequest(request, params.path!, 'GET')
}

export const POST: APIRoute = async ({ params, request }) => {
  return handleRequest(request, params.path!, 'POST')
}

export const PATCH: APIRoute = async ({ params, request }) => {
  return handleRequest(request, params.path!, 'PATCH')
}

export const DELETE: APIRoute = async ({ params, request }) => {
  return handleRequest(request, params.path!, 'DELETE')
}
