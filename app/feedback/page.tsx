import { getFeedbackByStatus } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { LucidePlus } from "lucide-react"
import Link from "next/link"
import { KanbanBoard } from "@/components/kanban-board"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function FeedbackListPage() {
  const feedbackByStatus = await getFeedbackByStatus()
  const hasFeedback = Object.values(feedbackByStatus).some((items) => items.length > 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feedback Board</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Drag and drop feedback items between columns to update their status
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/feedback/new">
            <LucidePlus className="h-4 w-4" />
            Submit New Feedback
          </Link>
        </Button>
      </div>

      {hasFeedback ? (
        <KanbanBoard initialFeedback={feedbackByStatus} />
      ) : (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle>No Feedback Yet</CardTitle>
            <CardDescription>Be the first to submit feedback for the Suncture Platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              We're waiting for your valuable insights! Submit your feedback to help us improve the platform.
            </p>
            <Button asChild>
              <Link href="/feedback/new">Submit Feedback Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
