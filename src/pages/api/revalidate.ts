import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const expectedSecret = import.meta.env.DRUPAL_REVALIDATE_SECRET

  if (!expectedSecret) {
    return new Response(JSON.stringify({ message: 'Revalidate secret not configured' }), { status: 500 })
  }

  try {
    const contentType = request.headers.get('content-type') || ''
    let secret: string | null = null
    let slug: string | null = null

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      secret = formData.get('secret') as string
      slug = formData.get('slug') as string
    } else {
      const body = await request.json()
      secret = body.secret || request.headers.get('x-revalidate-secret')
      slug = body.slug || body.path
    }

    if (secret !== expectedSecret) {
      return new Response(JSON.stringify({ message: 'Invalid secret' }), { status: 401 })
    }

    const path = slug ? (slug.startsWith('/') ? slug : `/${slug}`) : '/'

    // Astro SSR doesn't have built-in ISR revalidation like Next.js.
    // In a production setup, you'd purge a CDN cache here.
    console.log(`Revalidation triggered for: ${path}`)

    return new Response(JSON.stringify({
      revalidated: true,
      path,
      timestamp: Date.now(),
    }))
  } catch (error) {
    console.error('Revalidation error:', error)
    return new Response(JSON.stringify({ message: 'Revalidation failed' }), { status: 500 })
  }
}
