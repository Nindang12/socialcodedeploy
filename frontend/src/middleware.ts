import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register']
  const isPublicPath = publicPaths.includes(pathname)

  // Redirect to login if no token and not on public path
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to home if token exists and on public path
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 