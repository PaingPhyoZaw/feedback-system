import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const serviceCenters = await prisma.serviceCenter.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        location: true
      }
    })

    return NextResponse.json(serviceCenters)
  } catch (error) {
    console.error("Error fetching service centers:", error)
    return NextResponse.json(
      { error: "Failed to fetch service centers" },
      { status: 500 }
    )
  }
}
