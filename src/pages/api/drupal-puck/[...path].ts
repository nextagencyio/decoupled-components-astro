import type { APIRoute } from 'astro'
import { getSessionFromRequest, cleanupSessions } from '@/lib/puck-auth'

const DRUPAL_URL = import.meta.env.DRUPAL_BASE_URL

async function handleRequest(request: Request, path: string, method: string) {
  try {
    if (!DRUPAL_URL) {
      return new Response(JSON.stringify({ error: 'Drupal URL not configured' }), { status: 500 })
    }

    const drupalUrl = `${DRUPAL_URL}/api/puck/${path}`

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }

    let body: string | undefined

    if (method === 'POST') {
      cleanupSessions()
      const session = getSessionFromRequest(request)
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized. Please open the editor from Drupal.' }),
          { status: 401 }
        )
      }

      headers['Content-Type'] = 'application/json'
      headers['X-Puck-Token'] = session.token
      const rawBody = await request.json()
      body = JSON.stringify(rawBody)
    }

    const drupalResponse = await fetch(drupalUrl, {
      method,
      headers,
      body,
      signal: AbortSignal.timeout(30000),
    })

    const responseData = await drupalResponse.json()
    return new Response(JSON.stringify(responseData), { status: drupalResponse.status })
  } catch (error: any) {
    console.error('Puck proxy error:', error)
    return new Response(
      JSON.stringify({ error: `Puck proxy error: ${error.message}` }),
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
