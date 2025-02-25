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

      return {
        id: center.id,
        name: center.name,
        location: center.location,
        totalFeedback: center._count.feedbacks,
        averageRating:
          (calculateAverage("serviceRating") +
            calculateAverage("conditionRating") +
            calculateAverage("feeRating") +
            calculateAverage("durationRating")) /
          4,
        serviceRating: calculateAverage("serviceRating"),
        conditionRating: calculateAverage("conditionRating"),
        feeRating: calculateAverage("feeRating"),
        durationRating: calculateAverage("durationRating"),
      }
    })

    // Calculate overall statistics
    const overallStats = {
      totalFeedback: feedbacks.length,
      averageRating:
        feedbacks.length > 0
          ? feedbacks.reduce(
              (sum, fb) =>
                sum +
                (fb.serviceRating +
                  fb.conditionRating +
                  fb.feeRating +
                  fb.durationRating) /
                  4,
              0
            ) / feedbacks.length
          : 0,
      responseRate: 92, // This would need to be calculated based on your business logic
      customerSatisfaction: 89, // This would need to be calculated based on your business logic
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
