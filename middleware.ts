import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth')
  const isPublic = req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname === '/favicon.ico'

  if (isApiAuth || isPublic) return NextResponse.next()
  if (isLoginPage && isLoggedIn) return NextResponse.redirect(new URL('/dashboard', req.url))
  if (!isLoginPage && !isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
