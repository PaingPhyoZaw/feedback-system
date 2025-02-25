"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon, MessageSquare, TrendingUp } from "lucide-react"

interface Props {
  totalFeedbacks: number
  averageRating: number
  latestFeedback: {
    createdAt: string
  } | null
}

export function DashboardMetrics({ totalFeedbacks, averageRating }: Props) {
  // Calculate month-over-month growth (simulated for now)
  const monthlyGrowth = "+12.5%"

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalFeedbacks}</div>
              <p className="text-xs text-muted-foreground">
                Total feedback collected
              </p>
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2.5 py-0.5 rounded-full">
              {monthlyGrowth}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
          <StarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Average customer satisfaction
              </p>
            </div>
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full ${
                    i < Math.round(averageRating)
                      ? "bg-yellow-400"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">4.2</div>
              <p className="text-xs text-muted-foreground">
                This month's average rating
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-green-600 dark:text-green-400">↑</span>
              <span className="text-sm text-green-600 dark:text-green-400">0.3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
