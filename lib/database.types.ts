export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          status: "open" | "in_review" | "done" | "needs_refix"
          created_at: string
          created_by: string | null
          refix_count: number | null
          parent_serial_number: string | null
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
          status?: "open" | "in_review" | "done" | "needs_refix"
          created_at?: string
          created_by?: string | null
          refix_count?: number | null
          parent_serial_number?: string | null
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
          status?: "open" | "in_review" | "done" | "needs_refix"
          created_at?: string
          created_by?: string | null
          refix_count?: number | null
          parent_serial_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback_comments: {
        Row: {
          id: string
          feedback_id: string
          content: string
          user_id: string
          user_email: string
          created_at: string
        }
        Insert: {
          id?: string
          feedback_id: string
          content: string
          user_id: string
          user_email: string
          created_at?: string
        }
        Update: {
          id?: string
          feedback_id?: string
          content?: string
          user_id?: string
          user_email?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_comments_feedback_id_fkey"
            columns: ["feedback_id"]
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 