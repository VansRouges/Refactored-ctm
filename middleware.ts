import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Get user authentication and role
  const userRole = (await auth()).sessionClaims?.metadata?.role;

  // Redirect admin users to /admin
  if (userRole === "admin" && !isAdminRoute(req)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Redirect authenticated non-admin users to /dashboard
  if (userRole !== "admin" && !isDashboardRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow admin routes only for admins
  if (isAdminRoute(req) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect dashboard routes
  if (isDashboardRoute(req)) {
    const authResponse = await auth.protect();
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    return NextResponse.next();
  }

  // Default allow other routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
