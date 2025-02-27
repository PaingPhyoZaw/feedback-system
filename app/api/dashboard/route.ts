import { NextResponse } from "next/server"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    const response = NextResponse.json({
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
    })

    // Set cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
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