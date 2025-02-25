import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany()
    
    if (feedbacks.length === 0) {
      return NextResponse.json([
        { category: "Service", average: 0 },
        { category: "Condition", average: 0 },
        { category: "Fee", average: 0 },
        { category: "Duration", average: 0 },
      ])
    }

    const averages = {
      service: 0,
      condition: 0,
      fee: 0,
      duration: 0,
    }

    feedbacks.forEach((feedback) => {
      averages.service += feedback.serviceRating
      averages.condition += feedback.conditionRating
      averages.fee += feedback.feeRating
      averages.duration += feedback.durationRating
    })

    const count = feedbacks.length

    const formattedData = [
      { category: "Service", average: Number((averages.service / count).toFixed(1)) },
      { category: "Condition", average: Number((averages.condition / count).toFixed(1)) },
      { category: "Fee", average: Number((averages.fee / count).toFixed(1)) },
      { category: "Duration", average: Number((averages.duration / count).toFixed(1)) },
    ]

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error calculating average ratings:", error)
    return NextResponse.json(
      { error: "Failed to calculate average ratings" },
      { status: 500 }
    )
  }
}
