import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const center = searchParams.get('center') || 'mdy'
    const json = await request.json()

    const feedback = await prisma.feedback.create({
      data: {
        serviceRating: 5 - json.staff || 0,
        conditionRating: 5 - json.condition || 0,
        feeRating: 5 - json.fee || 0,
        durationRating: 5 - json.duration || 0,
        comment: json.comment || '',
        serviceCenterId: center
      },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error creating feedback:", error)
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        serviceCenter: true
      },
      take: 100
    })

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}