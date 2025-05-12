import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getCookies, isAppRouter } from "@/lib/compatibility"

// For App Router (app directory)
export const createServerSupabaseClient = async () => {
  try {
    if (isAppRouter()) {
      const cookies = await getCookies()
      if (cookies) {
        return createServerComponentClient<Database>({ cookies })
      }
    }
    // If we're not in App Router or cookies couldn't be retrieved
    return null
  } catch (error) {
    // Fallback for Pages Router
    console.error("Error creating server Supabase client:", error)
    // Return a dummy client that will be replaced in actual usage
    return null
  }
}

// For Pages Router (pages directory)
export const createServerSupabaseClientForPages = (
  context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse },
) => {
  return createServerComponentClient<Database>({ cookies: () => context.req.cookies })
}
