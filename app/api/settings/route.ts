import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const settings = await prisma.settings.findFirst()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      adminEmail: body.adminEmail,
      notificationEmail: body.notificationEmail,
      feedbackFormTitle: body.feedbackFormTitle,
    },
    create: {
      adminEmail: body.adminEmail,
      notificationEmail: body.notificationEmail,
      feedbackFormTitle: body.feedbackFormTitle,
    },
  })

  return NextResponse.json(settings)
}