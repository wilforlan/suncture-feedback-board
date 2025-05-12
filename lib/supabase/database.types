export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          id: string
          serial_number: string
          defect_description: string
          precondition: string
          steps_to_recreate: string
          expected_result: string
          actual_result: string
          severity: "Low" | "Medium" | "High" | "Critical"
          testing_device: "Mobile" | "Desktop" | "Tablet" | "Other"
          screenshot_url: string | null
          name: string
          email: string
          phone_number: string
          profession: string
          location: string
          most_useful_feature: string
          chatbot_rating: number
          status: "open" | "in_review" | "done"
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          serial_number: string
          defect_description: string
          precondition: string
          steps_to_recreate: string
          expected_result: string
          actual_result: string
          severity: "Low" | "Medium" | "High" | "Critical"
          testing_device: "Mobile" | "Desktop" | "Tablet" | "Other"
          screenshot_url?: string | null
          name: string
          email: string
          phone_number: string
          profession: string
          location: string
          most_useful_feature: string
          chatbot_rating: number
          status?: "open" | "in_review" | "done"
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          serial_number?: string
          defect_description?: string
          precondition?: string
          steps_to_recreate?: string
          expected_result?: string
          actual_result?: string
          severity?: "Low" | "Medium" | "High" | "Critical"
          testing_device?: "Mobile" | "Desktop" | "Tablet" | "Other"
          screenshot_url?: string | null
          name?: string
          email?: string
          phone_number?: string
          profession?: string
          location?: string
          most_useful_feature?: string
          chatbot_rating?: number
          status?: "open" | "in_review" | "done"
          created_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      feedback_status: "open" | "in_review" | "done"
    }
  }
}
