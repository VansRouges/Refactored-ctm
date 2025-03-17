import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)'
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Fetch the authenticated user and their role
  const { sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata?.role

  // Redirect logic based on role
  if (userRole === 'admin' && !isAdminRoute(req)) {
    // If the user is an admin and not already on an admin route, redirect to /admin
    return NextResponse.redirect(new URL('/admin', req.url))
  } else if (userRole !== 'admin' && !isDashboardRoute(req)) {
    // If the user is not an admin and not already on a dashboard route, redirect to /dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect admin routes: only admins can access them
  if (isAdminRoute(req) && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Protect dashboard routes: only authenticated users can access them
  if (isDashboardRoute(req)) {
    await auth.protect()
  }

  // Default behavior for all other protected routes
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}