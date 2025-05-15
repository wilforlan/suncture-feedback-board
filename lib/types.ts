export type Severity = "Low" | "Medium" | "High" | "Critical"
export type TestingDevice = "Mobile" | "Desktop" | "Tablet" | "Other"
export type FeedbackStatus = "open" | "in_review" | "done" | "needs_refix"

export type Feedback = {
  id: string
  serial_number: string
  defect_description: string
  precondition: string
  steps_to_recreate: string
  expected_result: string
  actual_result: string
  severity: Severity
  testing_device: TestingDevice
  screenshot_url?: string | null

  // User information
  name: string
  email: string
  phone_number: string
  profession: string
  location: string
  most_useful_feature: string
  chatbot_rating: number

  // Status and metadata
  status: FeedbackStatus
  created_at: string
  created_by?: string | null
  refix_count?: number
  parent_serial_number?: string
}

export type FeedbackFormData = Omit<Feedback, "id" | "created_at" | "status"> & {
  screenshot?: File | null
}

export type FeedbackComment = {
  id: string
  feedback_id: string
  content: string
  user_id: string
  user_email: string
  created_at: string
}
