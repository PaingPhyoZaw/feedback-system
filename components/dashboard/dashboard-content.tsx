"use client"

import { useEffect, useState } from "react"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { RatingAverageChart } from "@/components/dashboard/rating-average-chart"
import { RecentFeedbackCards } from "@/components/dashboard/recent-feedback-cards"
import { Skeleton } from "@/components/ui/skeleton"

interface Feedback {
  id: string
  createdAt: string
  serviceRating: number
  conditionRating: number
  feeRating: number
  durationRating: number
  comment: string | null
}

interface DashboardData {
  recentFeedbacks: Feedback[]
  ratingData: Array<{ category: string; average: number }>
  metrics: {
    totalFeedbacks: number
    averageRating: number
    currentMonthCount: number
    previousMonthCount: number
    monthlyRating: number
    ratingDiff: number
  }
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/dashboard?t=${Date.now()}`, {
                                        cache: 'no-store',
                                    });
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchDashboardData()
  }, [])

  if (isLoading || !data) {
    return (
      <div className="flex-1 space-y-6">
        <DashboardMetricsSkeleton />
        <div className="grid gap-6 md:grid-cols-2">
          <ChartSkeleton />
          <RecentFeedbackSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      <DashboardMetrics {...data.metrics} />
      <div className="grid gap-6 md:grid-cols-2">
        <RatingAverageChart ratingData={data.ratingData} />
        <RecentFeedbackCards feedbacks={data.recentFeedbacks} />
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