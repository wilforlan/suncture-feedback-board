// This file provides compatibility functions for both App Router and Pages Router

// Function to check if we're in the App Router
export function isAppRouter(): boolean {
  try {
    // Try to require next/headers - this will throw an error in Pages Router
    require("next/headers")
    return true
  } catch (error) {
    return false
  }
}

// Function to safely get cookies in both environments
export async function getCookies() {
  if (isAppRouter()) {
    try {
      const { cookies } = await import("next/headers")
      return cookies()
    } catch (error) {
      console.error("Error importing cookies from next/headers:", error)
      return null
    }
  }
  return null
}

// Function to safely revalidate paths in both environments
export async function safeRevalidatePath(path: string) {
  if (isAppRouter()) {
    try {
      const { revalidatePath } = await import("next/cache")
      revalidatePath(path)
    } catch (error) {
      console.error("Error revalidating path:", error)
      // Continue even if revalidation fails
    }
  }
  // In Pages Router, we don't need to do anything as the page will be
  // revalidated on the next request automatically
}
