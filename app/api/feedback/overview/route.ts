import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { startOfMonth, endOfMonth } from "date-fns"

export async function GET() {
  try {
    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)

    const feedbacks = await prisma.feedback.findMany({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        createdAt: true,
        serviceRating: true,
        conditionRating: true,
        feeRating: true,
        durationRating: true,
        comment: true
      }
    })

    return NextResponse.json(feedbacks.map(feedback => ({
      ...feedback,
      createdAt: feedback.createdAt.toISOString()
    })))
  } catch (error) {
    console.error('Error fetching overview data:', error)
    return NextResponse.json({ error: 'Failed to fetch overview data' }, { status: 500 })
  }
}