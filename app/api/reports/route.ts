import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get("centerId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let feedbackQuery = {
      where: {
        ...(centerId && centerId !== "all" ? { serviceCenterId: centerId } : {}),
        ...(startDate && endDate
          ? {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
      },
      include: {
        serviceCenter: true,
      },
    }

    // Get all feedback data
    const feedbacks = await prisma.feedback.findMany(feedbackQuery)

    // Get service centers
    const serviceCenters = await prisma.serviceCenter.findMany({
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    })

    // Calculate statistics for each service center
    const centerStats = serviceCenters.map((center) => {
      const centerFeedbacks = feedbacks.filter(
        (f) => f.serviceCenterId === center.id
      )

      const calculateAverage = (key: keyof typeof centerFeedbacks[0]) => {
        if (centerFeedbacks.length === 0) return 0
        return (
          centerFeedbacks.reduce((sum, fb) => sum + (fb[key] as number), 0) /
          centerFeedbacks.length
        )
      }

      // Calculate response rate for this center
      // For example: if we expect 10 feedbacks per day and we got 7, response rate would be 70%
      const daysInRange = startDate && endDate 
        ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 30 // default to 30 days if no date range
      
      const expectedFeedbacksPerDay = 3 // You can adjust this based on your business requirements
      const expectedTotal = daysInRange * expectedFeedbacksPerDay
      const responseRate = Math.round((centerFeedbacks.length / expectedTotal) * 100)

      return {
        id: center.id,
        name: center.name,
        location: center.location,
        totalFeedback: centerFeedbacks.length,
        responseRate: responseRate,
        averageRating:
          Math.round(
            (calculateAverage("serviceRating") +
              calculateAverage("conditionRating") +
              calculateAverage("feeRating") +
              calculateAverage("durationRating")) /
            4
          ),
        serviceRating: Math.round(calculateAverage("serviceRating")),
        conditionRating: Math.round(calculateAverage("conditionRating")),
        feeRating: Math.round(calculateAverage("feeRating")),
        durationRating: Math.round(calculateAverage("durationRating")),
        customerSatisfaction: Math.round(
          (calculateAverage("serviceRating") +
            calculateAverage("conditionRating") +
            calculateAverage("feeRating") +
            calculateAverage("durationRating")) /
          4 * 20 // Convert 0-5 rating to percentage
        ),
      }
    })

    // Calculate overall statistics
    const totalExpectedFeedbacks = serviceCenters.length * 
      (startDate && endDate 
        ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 30) * 3 // 3 feedbacks per day expected

    const overallStats = {
      totalFeedback: feedbacks.length,
      averageRating:
        feedbacks.length > 0
          ? Math.round(
              feedbacks.reduce(
                (sum, fb) =>
                  sum +
                  (fb.serviceRating +
                    fb.conditionRating +
                    fb.feeRating +
                    fb.durationRating) /
                    4,
                0
              ) / feedbacks.length
            )
          : 0,
      responseRate: Math.round((feedbacks.length / totalExpectedFeedbacks) * 100),
      customerSatisfaction: feedbacks.length > 0
        ? Math.round(
            feedbacks.reduce(
              (sum, fb) =>
                sum +
                (fb.serviceRating +
                  fb.conditionRating +
                  fb.feeRating +
                  fb.durationRating) /
                  4,
              0
            ) / feedbacks.length * 20 // Convert 0-5 rating to percentage
          )
        : 0,
    }

    return NextResponse.json({
      serviceCenters,
      centerStats,
      overallStats,
      feedbacks,
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}
