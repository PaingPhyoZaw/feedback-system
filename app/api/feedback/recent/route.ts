import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const recentFeedbacks = await prisma.feedback.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        serviceRating: true,
        conditionRating: true,
        feeRating: true,
        durationRating: true,
        comment: true,
      },
    })

    // Transform the date to ISO string format
    const formattedFeedbacks = recentFeedbacks.map(feedback => ({
      ...feedback,
      createdAt: feedback.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedFeedbacks)
  } catch (error) {
    console.error("Error fetching recent feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch recent feedback" },
      { status: 500 }
    )
  }
}
