import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { subMonths } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get("centerId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Calculate current and previous period dates
    const currentStartDate = startDate ? new Date(startDate) : new Date()
    const currentEndDate = endDate ? new Date(endDate) : new Date()
    const previousStartDate = subMonths(currentStartDate, 1)
    const previousEndDate = subMonths(currentEndDate, 1)

    // Query for current period
    let currentPeriodQuery = {
      where: {
        ...(centerId && centerId !== "all" ? { serviceCenterId: centerId } : {}),
        createdAt: {
          gte: currentStartDate,
          lte: currentEndDate,
        },
      },
      include: {
        serviceCenter: true,
      },
    }

    // Query for previous period
    let previousPeriodQuery = {
      where: {
        ...(centerId && centerId !== "all" ? { serviceCenterId: centerId } : {}),
        createdAt: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
      },
      include: {
        serviceCenter: true,
      },
    }

    // Get feedback data for both periods
    const [currentFeedbacks, previousFeedbacks, serviceCenters] = await Promise.all([
      prisma.feedback.findMany(currentPeriodQuery),
      prisma.feedback.findMany(previousPeriodQuery),
      prisma.serviceCenter.findMany({
        include: {
          _count: {
            select: { feedbacks: true },
          },
        },
      })
    ])

    // Calculate statistics for each service center
    const centerStats = serviceCenters.map((center) => {
      const centerCurrentFeedbacks = currentFeedbacks.filter(
        (f) => f.serviceCenterId === center.id
      )

      const calculateAverage = (feedbacks: any[], key: string) => {
        if (feedbacks.length === 0) return 0
        return Number((feedbacks.reduce((sum, fb) => sum + fb[key], 0) / feedbacks.length).toFixed(1))
      }

      // Calculate response rate
      const daysInRange = Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24))
      const expectedFeedbacksPerDay = 3
      const expectedTotal = daysInRange * expectedFeedbacksPerDay
      const responseRate = Math.round((centerCurrentFeedbacks.length / expectedTotal) * 100)

      // Calculate average ratings
      const avgRating = Number((
        (calculateAverage(centerCurrentFeedbacks, "serviceRating") +
          calculateAverage(centerCurrentFeedbacks, "conditionRating") +
          calculateAverage(centerCurrentFeedbacks, "feeRating") +
          calculateAverage(centerCurrentFeedbacks, "durationRating")) / 4
      ).toFixed(1))

      return {
        id: center.id,
        name: center.name,
        location: center.location,
        totalFeedback: centerCurrentFeedbacks.length,
        responseRate: responseRate,
        averageRating: avgRating,
        serviceRating: calculateAverage(centerCurrentFeedbacks, "serviceRating"),
        conditionRating: calculateAverage(centerCurrentFeedbacks, "conditionRating"),
        feeRating: calculateAverage(centerCurrentFeedbacks, "feeRating"),
        durationRating: calculateAverage(centerCurrentFeedbacks, "durationRating"),
        customerSatisfaction: Math.round(avgRating * 20), // Convert 0-5 rating to percentage
      }
    })

    // Calculate overall statistics for both periods
    const calculateOverallStats = (feedbacks: any[]) => {
      const totalExpectedFeedbacks = serviceCenters.length * 
        Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)) * 3

      const avgRating = feedbacks.length > 0
        ? Number((feedbacks.reduce((sum, fb) =>
            sum + (fb.serviceRating + fb.conditionRating + fb.feeRating + fb.durationRating) / 4, 0
          ) / feedbacks.length).toFixed(1))
        : 0

      return {
        totalFeedback: feedbacks.length,
        averageRating: avgRating,
        responseRate: Math.round((feedbacks.length / totalExpectedFeedbacks) * 100),
        customerSatisfaction: Math.round(avgRating * 20), // Convert 0-5 rating to percentage
      }
    }

    const currentStats = calculateOverallStats(currentFeedbacks)
    const previousStats = calculateOverallStats(previousFeedbacks)

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const changes = {
      totalFeedback: calculatePercentageChange(currentStats.totalFeedback, previousStats.totalFeedback),
      responseRate: calculatePercentageChange(currentStats.responseRate, previousStats.responseRate),
      customerSatisfaction: calculatePercentageChange(currentStats.customerSatisfaction, previousStats.customerSatisfaction)
    }

    return NextResponse.json({
      serviceCenters,
      centerStats,
      overallStats: {
        ...currentStats,
        changes
      },
      previousStats,
      feedbacks: currentFeedbacks,
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}
