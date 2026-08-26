import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-super-secret-key-1234567890'
)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  let payload = null

  if (token) {
    try {
      const verified = await jwtVerify(token, SECRET)
      payload = verified.payload as { id: string; email: string; role: string; name: string }
    } catch (error) {
      // Invalid token
    }
  }

  // Redirect authenticated users away from auth pages
  if (payload && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    if (payload.role === 'SEEKER') return NextResponse.redirect(new URL('/seeker/dashboard', request.url))
    if (payload.role === 'OWNER') return NextResponse.redirect(new URL('/owner/dashboard', request.url))
    if (payload.role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protect seeker routes
  if (pathname.startsWith('/seeker')) {
    if (!payload) return NextResponse.redirect(new URL('/login', request.url))
    if (payload.role !== 'SEEKER' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect owner routes
  if (pathname.startsWith('/owner')) {
    if (!payload) return NextResponse.redirect(new URL('/login', request.url))
    if (payload.role !== 'OWNER' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/seeker/:path*', '/owner/:path*', '/admin/:path*', '/login', '/signup'],
}
