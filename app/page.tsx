import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickFeedbackForm } from "@/components/quick-feedback-form"
import { UserLeaderboard } from "@/components/user-leaderboard"
import { LucideArrowRight, LucideClipboardList, LucidePlus, LucideUsers } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 opacity-90" />
        <div className="relative container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Suncture QA Feedback</h1>
          <p className="text-xl text-white/90 max-w-3xl mb-8">
            Help us improve the Suncture Platform by sharing your feedback, reporting bugs, and suggesting improvements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/feedback/new">
                <LucidePlus className="h-5 w-5" />
                Submit Detailed Feedback
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-white/90 gap-2">
              <Link href="/feedback">
                <LucideClipboardList className="h-5 w-5" />
                View All Feedback
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Contributors Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Contributors</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We appreciate everyone who helps make the Suncture Platform better. Here are our top contributors for this
            week.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <UserLeaderboard />
        </div>
      </section>

      {/* Quick Feedback Section */}
      <section className="container mx-auto px-4 py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Quick Feedback</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Have a quick thought or suggestion? Use this form to send us your feedback instantly. For detailed bug
              reports or feature requests, please use the detailed feedback form.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <LucideClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Report Issues</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Help us identify and fix bugs by reporting any issues you encounter.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-teal-600 dark:text-teal-400"
                  >
                    <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Suggest Improvements</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Share your ideas on how we can make the Suncture Platform better.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <LucideUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Join Our Community</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Be part of our growing community of testers and help shape the future of Suncture.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card className="shadow-lg border-0">
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2 rounded-t-lg" />
              <CardHeader>
                <CardTitle>Send Quick Feedback</CardTitle>
                <CardDescription>Share your thoughts, suggestions, or report a quick issue</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickFeedbackForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Our feedback system makes it easy to report issues, track their status, and see when they're resolved.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <LucidePlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Submit Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Fill out our detailed feedback form to report bugs, issues, or suggest improvements.
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/feedback/new">
                    Get Started
                    <LucideArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="bg-teal-100 dark:bg-teal-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-teal-600 dark:text-teal-400"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                </div>
                <CardTitle>Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  View all submitted feedback on our Kanban board and track the status of each item.
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/feedback">
                    View Board
                    <LucideArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <CardTitle>See Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Watch as your feedback is implemented and issues are resolved in the Suncture Platform.
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/auth">
                    Sign In
                    <LucideArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to help improve Suncture?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join our community of testers and help us make the Suncture Platform better for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/feedback/new">
                <LucidePlus className="h-5 w-5" />
                Submit Feedback
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
            >
              <Link href="/auth">Sign In / Register</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
