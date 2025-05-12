"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { LucideCheck, LucideLoader2 } from "lucide-react"

export function QuickFeedbackForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user?.user_metadata?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Generate a simple serial number for quick feedback
      const serial_number = `QF-${Date.now().toString().substring(7)}`

      // Prepare the feedback data
      const feedbackData = {
        serial_number,
        defect_description: message,
        precondition: feedbackType === "bug" ? "Quick feedback submission" : "",
        steps_to_recreate: feedbackType === "bug" ? "Submitted via quick feedback form" : "",
        expected_result: feedbackType === "bug" ? "N/A - Quick feedback" : "",
        actual_result: feedbackType === "bug" ? "N/A - Quick feedback" : "",
        severity: feedbackType === "bug" ? "Low" : "Medium",
        testing_device: "Other",

        name,
        email,
        phone_number: "N/A - Quick feedback",
        profession: "N/A - Quick feedback",
        location: "N/A - Quick feedback",
        most_useful_feature: feedbackType === "suggestion" ? message : "N/A - Quick feedback",
        chatbot_rating: 3,

        status: "open",
        created_by: user?.id || null,
      }

      // Submit the feedback
      const { error } = await supabase.from("feedback").insert(feedbackData)

      if (error) {
        console.error("Error submitting quick feedback:", error)
        toast({
          title: "Error submitting feedback",
          description: "There was a problem submitting your feedback. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        })

        // Reset the form
        setMessage("")
        if (!user) {
          setName("")
          setEmail("")
        }
      }
    } catch (error) {
      console.error("Error in quick feedback submission:", error)
      toast({
        title: "Error submitting feedback",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!user && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label>Feedback Type</Label>
        <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="suggestion" id="suggestion" />
            <Label htmlFor="suggestion" className="cursor-pointer">
              Suggestion
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bug" id="bug" />
            <Label htmlFor="bug" className="cursor-pointer">
              Bug Report
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Your Feedback</Label>
        <Textarea
          id="message"
          placeholder={
            feedbackType === "suggestion"
              ? "Share your ideas on how we can improve..."
              : "Describe the issue you encountered..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isLoading}>
        {isLoading ? (
          <>
            <LucideLoader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <LucideCheck className="h-4 w-4" />
            Submit Feedback
          </>
        )}
      </Button>

      {!user && (
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          For more detailed feedback, please{" "}
          <a href="/auth" className="text-blue-600 dark:text-blue-400 hover:underline">
            sign in
          </a>{" "}
          or use our{" "}
          <a href="/feedback/new" className="text-blue-600 dark:text-blue-400 hover:underline">
            detailed feedback form
          </a>
          .
        </p>
      )}
    </form>
  )
}
