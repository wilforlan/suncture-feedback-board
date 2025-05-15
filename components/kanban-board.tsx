"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { updateFeedbackStatus } from "@/lib/data"
import type { Feedback, FeedbackStatus } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { LucideLoader2 } from "lucide-react"
import Link from "next/link"

type KanbanColumnProps = {
  title: string
  feedbackItems: Feedback[]
  status: FeedbackStatus
  onDrop: (id: string, status: FeedbackStatus) => void
  isProcessing: Record<string, boolean>
}

function KanbanColumn({ title, feedbackItems, status, onDrop, isProcessing }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    onDrop(id, status)
  }

  return (
    <div className="flex flex-col h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="bg-muted rounded-t-lg p-3">
        <h3 className="font-medium flex items-center gap-2">
          {title}
          <Badge variant="outline" className="ml-2">
            {feedbackItems?.length}
          </Badge>
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 bg-muted/50 rounded-b-lg">
        {feedbackItems?.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-muted-foreground text-sm border border-dashed rounded-md">
            No items
          </div>
        ) : (
          <div className="space-y-2">
            {feedbackItems?.map((feedback) => (
              <div
                key={feedback.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", feedback.id)
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <Link href={`/feedback/${feedback.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-3 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          {feedback.serial_number}
                          {typeof feedback.refix_count === 'number' && feedback.refix_count > 0 && (
                            <Badge variant="secondary" className="ml-2">Refix: {feedback.refix_count}</Badge>
                          )}
                        </CardTitle>
                        <Badge
                          variant={
                            feedback.severity === "Critical"
                              ? "destructive"
                              : feedback.severity === "High"
                                ? "destructive"
                                : feedback.severity === "Medium"
                                  ? "default"
                                  : "outline"
                          }
                          className="text-xs"
                        >
                          {feedback.severity}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1">{feedback.defect_description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {isProcessing[feedback.id] ? (
                          <div className="flex items-center gap-1">
                            <LucideLoader2 className="h-3 w-3 animate-spin" />
                            <span>Moving...</span>
                          </div>
                        ) : (
                          <>
                            <Badge variant="outline" className="text-xs">
                              {feedback.testing_device}
                            </Badge>
                            <span>•</span>
                            <span>{formatDate(feedback.created_at, true)}</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type KanbanBoardProps = {
  initialFeedback: Record<FeedbackStatus, Feedback[]>
}

export function KanbanBoard({ initialFeedback }: KanbanBoardProps) {
  const [feedbackByStatus, setFeedbackByStatus] = useState<Record<FeedbackStatus, Feedback[]>>(initialFeedback)
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const handleDrop = async (id: string, newStatus: FeedbackStatus) => {
    // Find the feedback item
    let feedbackItem: Feedback | undefined
    let currentStatus: FeedbackStatus | undefined

    for (const [status, items] of Object.entries(feedbackByStatus) as [FeedbackStatus, Feedback[]][]) {
      const item = items.find((item) => item.id === id)
      if (item) {
        feedbackItem = item
        currentStatus = status
        break
      }
    }

    if (!feedbackItem || !currentStatus || currentStatus === newStatus) {
      return
    }

    // Mark as processing
    setIsProcessing((prev) => ({ ...prev, [id]: true }))

    // Optimistically update the UI
    setFeedbackByStatus((prev) => {
      const newFeedbackByStatus = { ...prev }

      // Ensure arrays are initialized
      if (!newFeedbackByStatus[currentStatus!]) {
        newFeedbackByStatus[currentStatus!] = []
      }
      if (!newFeedbackByStatus[newStatus]) {
        newFeedbackByStatus[newStatus] = []
      }

      // Remove from current status
      newFeedbackByStatus[currentStatus!] = newFeedbackByStatus[currentStatus!].filter((item) => item.id !== id)

      // Add to new status, increment refix_count if moving to needs_refix
      let updatedItem = { ...feedbackItem!, status: newStatus }
      if (newStatus === 'needs_refix') {
        updatedItem.refix_count = (updatedItem.refix_count || 0) + 1
      }
      newFeedbackByStatus[newStatus] = [updatedItem, ...(newFeedbackByStatus[newStatus] || [])]

      return newFeedbackByStatus
    })

    // Update in the database
    try {
      const success = await updateFeedbackStatus(id, newStatus)

      if (!success) {
        throw new Error("Failed to update status")
      }

      toast({
        title: "Status updated",
        description: `Feedback moved to ${newStatus.replace("_", " ")}`,
      })
    } catch (error) {
      // Revert the UI change on error
      setFeedbackByStatus((prev) => {
        const newFeedbackByStatus = { ...prev }

        // Ensure arrays are initialized
        if (!newFeedbackByStatus[currentStatus!]) {
          newFeedbackByStatus[currentStatus!] = []
        }
        if (!newFeedbackByStatus[newStatus]) {
          newFeedbackByStatus[newStatus] = []
        }

        // Remove from new status
        newFeedbackByStatus[newStatus] = newFeedbackByStatus[newStatus].filter((item) => item.id !== id)

        // Add back to original status
        newFeedbackByStatus[currentStatus!] = [
          { ...feedbackItem!, status: currentStatus! },
          ...(newFeedbackByStatus[currentStatus!] || []),
        ]

        return newFeedbackByStatus
      })

      toast({
        title: "Error updating status",
        description: "Failed to update feedback status. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Clear processing state
      setIsProcessing((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
      <KanbanColumn
        title="Open"
        feedbackItems={feedbackByStatus.open}
        status="open"
        onDrop={handleDrop}
        isProcessing={isProcessing}
      />
      <KanbanColumn
        title="In Review"
        feedbackItems={feedbackByStatus.in_review}
        status="in_review"
        onDrop={handleDrop}
        isProcessing={isProcessing}
      />
      <KanbanColumn
        title="Done"
        feedbackItems={feedbackByStatus.done}
        status="done"
        onDrop={handleDrop}
        isProcessing={isProcessing}
      />
      <KanbanColumn
        title="Needs Refix"
        feedbackItems={feedbackByStatus.needs_refix}
        status="needs_refix"
        onDrop={handleDrop}
        isProcessing={isProcessing}
      />
    </div>
  )
}
