"use server"

import { safeRevalidatePath } from "@/lib/compatibility"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"
import type { FeedbackFormData } from "@/lib/types"
import { getNextSerialNumber } from "@/lib/data"

// This is a workaround to avoid direct imports of next/headers
let cookiesModule: any
try {
  cookiesModule = require("next/headers")
} catch (error) {
  console.error("Error importing cookies from next/headers:", error)
  cookiesModule = null
}

export async function submitFeedback(
  formData: FeedbackFormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    // Check if we have access to cookies
    if (!cookiesModule) {
      return { success: false, message: "Server actions are not available in this environment" }
    }

    // Create a Supabase client for server actions
    const supabase = createServerActionClient<Database>({ cookies: cookiesModule.cookies })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "You must be logged in to submit feedback" }
    }

    // Get the next serial number
    const serial_number = await getNextSerialNumber()

    // Handle file upload if there's a screenshot
    let screenshot_url = null
    if (formData.screenshot) {
      const file = formData.screenshot
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage.from("screenshots").upload(fileName, file)

      if (uploadError) {
        console.error("Error uploading file:", uploadError)
        return { success: false, message: "Error uploading screenshot" }
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("screenshots").getPublicUrl(fileName)

      screenshot_url = publicUrl
    }

    // Insert the feedback into the database
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        serial_number,
        defect_description: formData.defect_description,
        precondition: formData.precondition,
        steps_to_recreate: formData.steps_to_recreate,
        expected_result: formData.expected_result,
        actual_result: formData.actual_result,
        severity: formData.severity,
        testing_device: formData.testing_device,
        screenshot_url,

        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        profession: formData.profession,
        location: formData.location,
        most_useful_feature: formData.most_useful_feature,
        chatbot_rating: formData.chatbot_rating,

        created_by: user.id,
        status: "open",
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error inserting feedback:", error)
      return { success: false, message: "Error submitting feedback" }
    }

    // Safely revalidate path
    await safeRevalidatePath("/feedback")

    return {
      success: true,
      message: `Feedback submitted successfully with ID: ${serial_number}`,
      id: data.id,
    }
  } catch (error) {
    console.error("Error in submitFeedback:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
