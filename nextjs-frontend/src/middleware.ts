import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect old login/register routes to new system
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/new-login', request.url))
  }

  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/new-register', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register'
  ]
}
