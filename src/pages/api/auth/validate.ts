import type { APIRoute } from 'astro'
import { createSession, COOKIE_NAME, cleanupSessions } from '@/lib/puck-auth'

const DRUPAL_URL = import.meta.env.DRUPAL_BASE_URL

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!DRUPAL_URL) {
      return new Response(JSON.stringify({ error: 'Drupal URL not configured' }), { status: 500 })
    }

    const { token } = await request.json()

    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 })
    }

    // Validate against Drupal.
    const res = await fetch(`${DRUPAL_URL}/api/puck/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data.error || 'Token validation failed' }),
        { status: res.status }
      )
    }

    // Create a server-side session.
    cleanupSessions()
    const sessionId = createSession(
      data.user.uid,
      data.user.name,
      data.node.nid,
      token
    )

    const isProduction = import.meta.env.PROD
    const cookieFlags = `HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=${8 * 60 * 60}`

    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.append('Set-Cookie', `${COOKIE_NAME}=${sessionId}; ${cookieFlags}`)
    // Store raw token in a separate cookie for serverless fallback.
    // In-memory sessions don't persist across function instances,
    // so this cookie lets us re-authenticate with Drupal directly.
    headers.append('Set-Cookie', `puck_token=${token}; ${cookieFlags}`)

    return new Response(JSON.stringify({
      success: true,
      user: { uid: data.user.uid, name: data.user.name },
      node: data.node,
    }), {
      headers,
    })
  } catch (error: any) {
    console.error('Auth validation error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
