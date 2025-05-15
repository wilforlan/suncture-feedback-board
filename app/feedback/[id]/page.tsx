import { getFeedbackById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LucideArrowLeft, LucideLink, LucideMessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { FeedbackActions } from "@/components/feedback-actions"

export default async function FeedbackDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const feedback = await getFeedbackById(params.id)

  if (!feedback) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-6 gap-2">
        <Link href="/feedback">
          <LucideArrowLeft className="h-4 w-4" />
          Back to Feedback Board
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {feedback.serial_number}
                    <Badge
                      variant={
                        feedback.status === "open"
                          ? "default"
                          : feedback.status === "in_review"
                            ? "secondary"
                            : "success"
                      }
                      className="ml-2"
                    >
                      {feedback.status.replace("_", " ")}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Reported on {formatDate(feedback.created_at)}</CardDescription>
                </div>
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
                  className="text-sm"
                >
                  {feedback.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {feedback.parent_serial_number && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LucideLink className="h-4 w-4" />
                  <span>Related to:</span>
                  <Link
                    href={`/feedback/${feedback.parent_serial_number}`}
                    className="text-primary hover:underline"
                  >
                    {feedback.parent_serial_number}
                  </Link>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-2">Defect Description</h3>
                <p className="text-slate-700 dark:text-slate-300">{feedback.defect_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Precondition</h3>
                  <p className="text-slate-700 dark:text-slate-300">{feedback.precondition}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Testing Device</h3>
                  <p className="text-slate-700 dark:text-slate-300">{feedback.testing_device}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Steps to Recreate</h3>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {feedback.steps_to_recreate}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Expected Result</h3>
                  <p className="text-slate-700 dark:text-slate-300">{feedback.expected_result}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Actual Result</h3>
                  <p className="text-slate-700 dark:text-slate-300">{feedback.actual_result}</p>
                </div>
              </div>

              {feedback.screenshot_url && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Screenshot/Evidence</h3>
                  <div className="relative h-64 w-full rounded-md overflow-hidden border">
                    <Image
                      src={feedback.screenshot_url || "/placeholder.svg"}
                      alt="Screenshot evidence"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <LucideMessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Comments & Status Updates</h3>
                </div>
                <FeedbackActions
                  feedbackId={feedback.id}
                  currentStatus={feedback.status}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2" />
            <CardHeader>
              <CardTitle>Reporter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</h3>
                <p>{feedback.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</h3>
                <p>{feedback.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone</h3>
                <p>{feedback.phone_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Profession</h3>
                <p>{feedback.profession}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Location</h3>
                <p>{feedback.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Most Useful Feature</h3>
                <p>{feedback.most_useful_feature}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Chatbot Rating</h3>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < feedback.chatbot_rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{feedback.chatbot_rating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
