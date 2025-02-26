import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { startOfDay, endOfDay } from 'date-fns'

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const centerId = searchParams.get('centerId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where = {
      ...(centerId && { serviceCenterId: centerId }),
      ...(from && to && {
        createdAt: {
          gte: startOfDay(new Date(from)),
          lte: endOfDay(new Date(to)),
        },
      }),
    }

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          serviceCenter: true
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.feedback.count({ where })
    ])

    return NextResponse.json({
      feedbacks,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}