import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTopUsersByFeedbackCount } from "@/lib/data"
import Link from "next/link"

// Ranking emojis for different positions
const rankEmojis = ["🏆", "🥈", "🥉", "🌟", "✨"]

export async function UserLeaderboard() {
  const topUsers = await getTopUsersByFeedbackCount(5)
  const hasTopUsers = topUsers.length > 2

  return (
    <div className="space-y-8">
      {/* Top User Highlight or Promo */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white">
        <div className="flex flex-col items-center text-center">
          {hasTopUsers ? (
            // Top user content
            <>
              <div className="text-5xl mb-4">👑</div>
              <h3 className="text-2xl font-bold mb-2">{topUsers[0].name}</h3>
              <p className="text-white/80 mb-4">{topUsers[0].email}</p>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-4">
                {topUsers[0].count} Feedback Submissions This Week
              </Badge>
              <div className="max-w-md">
                <p className="text-lg italic mb-4">
                  "Thank you for your outstanding contributions to improving the Suncture Platform! Your detailed
                  feedback has been invaluable in helping us identify and fix issues."
                </p>
                <div className="bg-white/10 rounded-lg p-4 mt-2">
                  <h4 className="font-bold text-lg mb-2">🎁 Weekly Reward Winner!</h4>
                  <p>
                    Congratulations! You've earned this week's reward: A $50 Amazon gift card and exclusive early access
                    to our next feature release!
                  </p>
                </div>
              </div>
            </>
          ) : (
            // Promotional content when no top users
            <>
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-2">This Week's Top Spot Is Waiting For You!</h3>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-4">
                Be The First To Submit Feedback
              </Badge>
              <div className="max-w-md">
                <p className="text-lg mb-4">
                  Submit quality feedback this week and claim the top spot on our leaderboard. We're looking for
                  detailed bug reports and thoughtful suggestions to improve the Suncture Platform.
                </p>
                <div className="bg-white/10 rounded-lg p-4 mt-2">
                  <h4 className="font-bold text-lg mb-2">🎁 Weekly Rewards Up For Grabs!</h4>
                  <p className="mb-4">
                    This week's top contributor will receive a reward from Suncture Admins and exclusive early access to our
                    next feature release!
                  </p>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/feedback/new">Submit Feedback Now</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Weekly Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📊</span> Weekly Leaderboard
          </CardTitle>
          <CardDescription>Top contributors for this week</CardDescription>
        </CardHeader>
        <CardContent>
          {hasTopUsers && topUsers.length > 0 ? (
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-xl w-8 text-center">{rankEmojis[index + 1] || "🔹"}</div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {user.count} submissions
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No feedback submissions yet this week. Be the first to contribute!
              </p>
              <Button asChild>
                <Link href="/feedback/new">Submit Feedback</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
