import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const requestedNext = url.searchParams.get('next') ?? '/dashboard'
  let next = '/dashboard'
  try {
    const destination = new URL(requestedNext, url.origin)
    if (destination.origin === url.origin && requestedNext.startsWith('/') && !requestedNext.includes('\\')) {
      next = destination.pathname + destination.search
    }
  } catch {
    // Malformed or external destinations fall back to the dashboard.
  }
  const response = NextResponse.redirect(new URL(next, url.origin))
  response.headers.set('Cache-Control', 'private, no-store')

  const fail = (reason: string) => {
    const login = new URL('/login', url.origin)
    login.searchParams.set('auth_error', reason)
    response.headers.set('Location', login.toString())
    return response
  }

  if (url.searchParams.has('error')) return fail('provider')
  if (!code) return fail('missing_code')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return fail('unavailable')

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.session) {
      // Log only the error code: never log authorization codes or session tokens.
      console.error('Auth code exchange failed:', error?.code ?? 'missing_session')
      return fail('session')
    }
    return response
  } catch {
    console.error('Auth callback could not reach the authentication service')
    return fail('unavailable')
  }
}
