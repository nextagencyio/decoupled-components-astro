import type { APIRoute } from 'astro'
import { getSession, getOtherEditors, touchSession, COOKIE_NAME } from '@/lib/puck-auth'

export const GET: APIRoute = async ({ request }) => {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (!match) {
    return new Response(JSON.stringify({ editors: [] }))
  }

  const sessionId = match[1]
  const session = getSession(sessionId)
  if (!session) {
    return new Response(JSON.stringify({ editors: [] }))
  }

  // Heartbeat
  touchSession(sessionId)

  // Find other editors with different tokens on the same node
  const others = getOtherEditors(session.nid, session.token)
  return new Response(JSON.stringify({ editors: others }))
}
