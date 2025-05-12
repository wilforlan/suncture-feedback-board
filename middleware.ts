import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Create a Supabase client for the middleware
    const supabase = createMiddlewareClient({ req, res })

    // Refresh the session if needed
    await supabase.auth.getSession()

    return res
  } catch (error) {
    console.error("Error in middleware:", error)
    return res
  }
}

// Only run the middleware on auth-related routes
export const config = {
  matcher: ["/auth/:path*", "/feedback/new/:path*"],
}
