import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { RatingAverageChart } from "@/components/dashboard/rating-average-chart"
import { RecentFeedbackCards } from "@/components/dashboard/recent-feedback-cards"
import { Skeleton } from "@/components/ui/skeleton"

async function getFeedbackData() {
  // Get recent feedbacks
  const recentFeedbacks = await prisma.feedback.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      createdAt: true,
      serviceRating: true,
      conditionRating: true,
      feeRating: true,
      durationRating: true,
      comment: true,
    }
  })

  // Calculate rating averages
  const feedbacks = await prisma.feedback.findMany()
  const ratingData = feedbacks.length > 0 
    ? [
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
    : [
        { category: "Service", average: 0 },
        { category: "Condition", average: 0 },
        { category: "Fee", average: 0 },
        { category: "Duration", average: 0 }
      ]

  // Calculate overall metrics
  const totalFeedbacks = feedbacks.length
  const averageRating = totalFeedbacks > 0
    ? Number((feedbacks.reduce((sum, f) => 
        sum + (f.serviceRating + f.conditionRating + f.feeRating + f.durationRating) / 4, 0
      ) / totalFeedbacks).toFixed(1))
    : 0

  // Format dates and prepare data
  const formattedFeedbacks = recentFeedbacks.map(feedback => ({
    ...feedback,
    createdAt: feedback.createdAt.toISOString()
  }))

  return {
    recentFeedbacks: formattedFeedbacks,
    ratingData,
    metrics: {
      totalFeedbacks,
      averageRating
    }
  }
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
