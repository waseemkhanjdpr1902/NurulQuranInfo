import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

function getSafeRedirect(nextParam: string | null) {
  if (!nextParam) return '/dashboard'
  if (!nextParam.startsWith('/') || nextParam.startsWith('//')) return '/dashboard'
  if (!/^\/[A-Za-z0-9/_?=&%#.-]*$/.test(nextParam)) return '/dashboard'
  return nextParam
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = getSafeRedirect(searchParams.get('next'))

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (error) {
      console.error("Auth callback failed:", error)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
