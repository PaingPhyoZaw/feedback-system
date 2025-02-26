import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { format } from 'date-fns'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get('centerId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where = {
      ...(centerId && { serviceCenterId: centerId }),
      ...(from && to && {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      }),
    }

    const feedbacks = await prisma.feedback.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        serviceCenter: true,
      },
    })

    // Convert feedbacks to CSV format
    const headers = [
      'Date',
      'Time',
      'Service Center',
      'Location',
      'Service Rating',
      'Condition Rating',
      'Fee Rating',
      'Duration Rating',
      'Comment'
    ]

    const rows = feedbacks.map(feedback => [
      format(new Date(feedback.createdAt), 'MMM d, yyyy'),
      format(new Date(feedback.createdAt), 'h:mm a'),
      feedback.serviceCenter.name,
      feedback.serviceCenter.location,
      feedback.serviceRating,
      feedback.conditionRating,
      feedback.feeRating,
      feedback.durationRating,
      feedback.comment || ''
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create response with CSV content
    const response = new NextResponse(csv)
    response.headers.set('Content-Type', 'text/csv')
    response.headers.set('Content-Disposition', `attachment; filename="feedback-list-${format(new Date(), 'yyyy-MM-dd')}.csv"`)
    
    return response
  } catch (error) {
    console.error("Error exporting feedback:", error)
    return NextResponse.json(
      { error: "Failed to export feedback" },
      { status: 500 }
    )
  }
}
