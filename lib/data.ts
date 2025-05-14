import type { Feedback, FeedbackStatus } from "./types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Get all feedback entries
export async function getAllFeedback(): Promise<Feedback[]> {
  try {
    const supabase = await createClientComponentClient()

    if (!supabase) {
      console.error("Supabase client not available")
      return []
    }

    const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedback:", error)
      return []
    }

    return data as Feedback[]
  } catch (error) {
    console.error("Error in getAllFeedback:", error)
    return []
  }
}

// Get feedback entries by status
export async function getFeedbackByStatus(): Promise<Record<FeedbackStatus, Feedback[]>> {
  try {
    const supabase = await createClientComponentClient()

    if (!supabase) {
      console.error("Supabase client not available")
      return { open: [], in_review: [], done: [] }
    }

    const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedback:", error)
      return { open: [], in_review: [], done: [] }
    }

    const feedbackByStatus: Record<FeedbackStatus, Feedback[]> = {
      open: [],
      in_review: [],
      done: [],
    }

    if (data && data.length > 0) {
      for (const item of data as Feedback[]) {
        if (item.status in feedbackByStatus) {
          feedbackByStatus[item.status as FeedbackStatus].push(item)
        } else {
          // Default to open if status is invalid
          feedbackByStatus.open.push({ ...item, status: "open" })
        }
      }
    }

    return feedbackByStatus
  } catch (error) {
    console.error("Error in getFeedbackByStatus:", error)
    return { open: [], in_review: [], done: [] }
  }
}

// Get a single feedback entry by ID
export async function getFeedbackById(id: string): Promise<Feedback | null> {
  try {
    const supabase = await createClientComponentClient()

    if (!supabase) {
      console.error("Supabase client not available")
      return null
    }

    const { data, error } = await supabase.from("feedback").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching feedback by ID:", error)
      return null
    }

    return data as Feedback
  } catch (error) {
    console.error("Error in getFeedbackById:", error)
    return null
  }
}

// Get the next serial number
export async function getNextSerialNumber(): Promise<string> {
  try {
    const supabase = await createClientComponentClient()

    if (!supabase) {
      console.error("Supabase client not available")
      return "BUG-001"
    }

    const { data, error } = await supabase
      .from("feedback")
      .select("serial_number")
      .order("created_at", { ascending: false })
      .limit(1)

    if (error || !data || data.length === 0) {
      return "BUG-001"
    }

    const lastSerialNumber = data[0].serial_number
    const match = lastSerialNumber.match(/BUG-(\d+)/)

    if (!match) {
      return "BUG-001"
    }

    const nextNumber = Number.parseInt(match[1], 10) + 1
    return `BUG-${nextNumber.toString().padStart(3, "0")}`
  } catch (error) {
    console.error("Error in getNextSerialNumber:", error)
    return "BUG-001"
  }
}

// Update feedback status (client-side)
export async function updateFeedbackStatus(id: string, status: FeedbackStatus): Promise<boolean> {
  try {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.from("feedback").update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating feedback status:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateFeedbackStatus:", error)
    return false
  }
}

// Get top users by feedback count for different time periods
export async function getTopUsersByFeedbackCount(
  limit = 5,
  period: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<
  {
    name: string
    email: string
    count: number
  }[]
> {
  try {
    const now = new Date()
    let startDate = new Date(now)

    // Set the start date based on the period
    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'weekly':
        startDate.setDate(now.getDate() - now.getDay()) // Go to the start of the week (Sunday)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'monthly':
        startDate.setDate(1) // Go to the start of the month
        startDate.setHours(0, 0, 0, 0)
        break
    }

    const supabase = createClientComponentClient<Database>()
    // Query to get feedback counts grouped by user
    const { data, error } = await supabase
      .from("feedback")
      .select("name, email, created_by")
      .gte("created_at", startDate.toISOString())
      .not("created_by", "is", null)

    if (error) {
      console.error("Error fetching top users:", error)
      return []
    }

    // Group by user and count
    const userCounts: Record<string, { name: string; email: string; count: number }> = {}

    for (const item of data) {
      if (!item.created_by) continue

      const key = item.created_by

      if (!userCounts[key]) {
        userCounts[key] = {
          name: item.name,
          email: maskEmail(item.email),
          count: 0,
        }
      }

      userCounts[key].count++
    }

    // Convert to array and sort by count
    const sortedUsers = Object.values(userCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .filter(q => !q.email.includes('undefined'))

    return sortedUsers
  } catch (error) {
    console.error("Error in getTopUsersByFeedbackCount:", error)
    return []
  }
}

// Helper function to mask email addresses
function maskEmail(email: string): string {
  const [username, domain] = email.split("@")

  if (username.length <= 3) {
    return `${username[0]}***@${domain}`
  }

  return `${username.substring(0, 3)}***@${domain}`
}
