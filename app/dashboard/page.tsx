import { Suspense } from "react"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { prisma } from "@/lib/prisma"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { RatingAverageChart } from "@/components/dashboard/rating-average-chart"
import { RecentFeedbackCards } from "@/components/dashboard/recent-feedback-cards"
import { Skeleton } from "@/components/ui/skeleton"

async function getFeedbackData() {
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const previousMonthStart = startOfMonth(subMonths(now, 1))
  const previousMonthEnd = endOfMonth(previousMonthStart)

  // Get all required data in parallel
  const [recentFeedbacks, feedbacks, currentMonthFeedbacks, previousMonthFeedbacks] = await Promise.all([
    prisma.feedback.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        serviceRating: true,
        conditionRating: true,
        feeRating: true,
        durationRating: true,
        comment: true,
      }
    }),
    prisma.feedback.findMany(),
    prisma.feedback.findMany({
      where: { createdAt: { gte: currentMonthStart } }
    }),
    prisma.feedback.findMany({
      where: { 
        createdAt: { 
          gte: previousMonthStart,
          lte: previousMonthEnd
        } 
      }
    })
  ])

  // Calculate rating averages for the chart
  const ratingData = calculateRatingData(feedbacks)

  // Calculate overall and monthly metrics
  const totalFeedbacks = feedbacks.length
  const averageRating = calculateAverageRating(feedbacks)
  const currentMonthRating = calculateAverageRating(currentMonthFeedbacks)
  const previousMonthRating = calculateAverageRating(previousMonthFeedbacks)

  return {
    recentFeedbacks: recentFeedbacks.map(f => ({
      ...f,
      createdAt: f.createdAt.toISOString()
    })),
    ratingData,
    metrics: {
      totalFeedbacks,
      averageRating,
      currentMonthCount: currentMonthFeedbacks.length,
      previousMonthCount: previousMonthFeedbacks.length,
      monthlyRating: currentMonthRating,
      ratingDiff: currentMonthRating - previousMonthRating
    }
  }
}

// Helper functions
function calculateAverageRating(feedbacks: any[]) {
  if (feedbacks.length === 0) return 0
  return Number((feedbacks.reduce((sum, f) => 
    sum + (f.serviceRating + f.conditionRating + f.feeRating + f.durationRating) / 4, 0
  ) / feedbacks.length).toFixed(1))
}

function calculateRatingData(feedbacks: any[]) {
  if (feedbacks.length === 0) {
    return [
      { category: "Service", average: 0 },
      { category: "Condition", average: 0 },
      { category: "Fee", average: 0 },
      { category: "Duration", average: 0 }
    ]
  }

  return [
    {
      category: "Service",
      average: Number((feedbacks.reduce((sum, f) => sum + f.serviceRating, 0) / feedbacks.length).toFixed(1))
    },
    {
      category: "Condition",
      average: Number((feedbacks.reduce((sum, f) => sum + f.conditionRating, 0) / feedbacks.length).toFixed(1))
    },
    {
      category: "Fee",
      average: Number((feedbacks.reduce((sum, f) => sum + f.feeRating, 0) / feedbacks.length).toFixed(1))
    },
    {
      category: "Duration",
      average: Number((feedbacks.reduce((sum, f) => sum + f.durationRating, 0) / feedbacks.length).toFixed(1))
    }
  ]
}

export default async function DashboardPage() {
  const data = await getFeedbackData()
  
  return (
    <div className="flex-1 space-y-6">
      
      <Suspense fallback={<DashboardMetricsSkeleton />}>
        <DashboardMetrics {...data.metrics} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <RatingAverageChart ratingData={data.ratingData} />
        </Suspense>
        
        <Suspense fallback={<RecentFeedbackSkeleton />}>
          <RecentFeedbackCards feedbacks={data.recentFeedbacks} />
        </Suspense>
      </div>
    </div>
  )
}

function DashboardMetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array(3).fill(null).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-[400px]" />
}

function RecentFeedbackSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5).fill(null).map((_, i) => (
        <Skeleton key={i} className="h-[120px]" />
      ))}
    </div>
  )
}
