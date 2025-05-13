import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTopUsersByFeedbackCount } from "@/lib/data"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

// Ranking emojis for different positions
const rankEmojis = ["🏆", "🥈", "🥉", "🌟", "✨"]

// Time period labels and their corresponding emojis
const timePeriods = [
  { id: "daily", label: "Daily", emoji: "🌅" },
  { id: "weekly", label: "Weekly", emoji: "📅" },
  { id: "monthly", label: "Monthly", emoji: "📊" },
]

export async function UserLeaderboard() {
  // Fetch data for different time periods
  const dailyTopUsers = await getTopUsersByFeedbackCount(5, "daily")
  const weeklyTopUsers = await getTopUsersByFeedbackCount(5, "weekly")
  const monthlyTopUsers = await getTopUsersByFeedbackCount(5, "monthly")

  // Get the #1 users from each category
  const topPerformers = [
    { period: "Daily", user: dailyTopUsers[0] },
    { period: "Weekly", user: weeklyTopUsers[0] },
    { period: "Monthly", user: monthlyTopUsers[0] },
  ].filter(item => item.user)

  return (
    <div className="space-y-8">
      {/* Top Performers Carousel */}
      <div className="relative">
        <h2 className="text-2xl font-bold mb-4">Top Performers</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {topPerformers.map((performer, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-4">👑</div>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-2">
                      {performer.period} Champion
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">{performer.user.name}</h3>
                    <p className="text-white/80 mb-4">{performer.user.email}</p>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-4">
                      {performer.user.count} Feedback Submissions
                    </Badge>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Time Period Tabs */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {timePeriods.map((period) => (
            <TabsTrigger key={period.id} value={period.id} className="flex items-center gap-2">
              <span>{period.emoji}</span>
              <span>{period.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Daily Leaderboard */}
        <TabsContent value="daily">
          <LeaderboardCard
            title="Daily Leaderboard"
            description="Top contributors for today"
            users={dailyTopUsers}
          />
        </TabsContent>

        {/* Weekly Leaderboard */}
        <TabsContent value="weekly">
          <LeaderboardCard
            title="Weekly Leaderboard"
            description="Top contributors for this week"
            users={weeklyTopUsers}
          />
        </TabsContent>

        {/* Monthly Leaderboard */}
        <TabsContent value="monthly">
          <LeaderboardCard
            title="Monthly Leaderboard"
            description="Top contributors for this month"
            users={monthlyTopUsers}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Separate component for the leaderboard card
function LeaderboardCard({ title, description, users }: { title: string; description: string; users: any[] }) {
  const hasUsers = users.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📊</span> {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasUsers ? (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl w-8 text-center">{rankEmojis[index] || "🔹"}</div>
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
              No feedback submissions yet. Be the first to contribute!
            </p>
            <Button asChild>
              <Link href="/feedback/new">Submit Feedback</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
