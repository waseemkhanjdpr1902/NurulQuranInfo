import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const requestedNext = searchParams.get('next') ?? '/dashboard'
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/dashboard'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${siteUrl}${next}`)
      }
    } catch (error) {
      console.error("Auth callback failed:", error)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${siteUrl}/login?error=Could not authenticate user`)
}
