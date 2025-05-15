"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { updateFeedbackStatus } from "@/lib/data"
import type { FeedbackStatus } from "@/lib/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { formatDate } from "@/lib/utils"
import type { Database } from "@/lib/database.types"
import { useRouter } from "next/navigation"
import { LucideArrowUp, LucideCheck, LucideLoader2, LucideMessageSquare, LucideSend } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type FeedbackComment = Database["public"]["Tables"]["feedback_comments"]["Row"]
type FeedbackCommentInsert = Database["public"]["Tables"]["feedback_comments"]["Insert"]

type FeedbackActionsProps = {
  feedbackId: string
  currentStatus: FeedbackStatus
}

export function FeedbackActions({ feedbackId, currentStatus }: FeedbackActionsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<FeedbackComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<FeedbackStatus>(currentStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClientComponentClient<Database>()

  const handleStatusChange = async (newStatus: FeedbackStatus) => {
    if (newStatus === status) return

    setIsLoading(true)
    try {
      const success = await updateFeedbackStatus(feedbackId, newStatus)
      if (success) {
        setStatus(newStatus)
        toast({
          title: "Status updated",
          description: `Feedback moved to ${newStatus.replace("_", " ")}`,
        })
        router.refresh()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Failed to update feedback status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    setIsSubmitting(true)
    try {
      const commentData: FeedbackCommentInsert = {
        feedback_id: feedbackId,
        content: comment.trim(),
        user_id: user.id,
        user_email: user.email || "",
      }

      const { data, error } = await supabase
        .from("feedback_comments")
        .insert(commentData)
        .select()
        .single()

      if (error) throw error

      setComments((prev) => [data, ...prev])
      setComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error adding comment",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const loadComments = async () => {
      const { data, error } = await supabase
        .from("feedback_comments")
        .select("*")
        .eq("feedback_id", feedbackId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setComments(data)
      }
    }

    loadComments()
  }, [feedbackId, supabase])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="needs_refix">Needs Refix</SelectItem>
          </SelectContent>
        </Select>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LucideLoader2 className="h-4 w-4 animate-spin" />
            <span>Updating status...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {user ? (
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.email || ""} />
                <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!comment.trim() || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <LucideLoader2 className="h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <LucideSend className="h-4 w-4" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <LucideMessageSquare className="h-4 w-4" />
                Sign in to add comments
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://avatar.vercel.sh/${comment.user_email}`} alt={comment.user_email} />
                <AvatarFallback>{comment.user_email[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.user_email}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 