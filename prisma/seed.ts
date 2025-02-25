import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('password', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })
  
  console.log({ admin })

  // Create service centers
  const centers = [
    {
      id: "mdy",
      name: "1.Care MDY",
      location: "Mandalay",
      manager: "Manager MDY",
      contactInfo: "+95 9123456789"
    },
    {
      id: "ygn",
      name: "1.Care YGN",
      location: "Yangon",
      manager: "Manager YGN",
      contactInfo: "+95 9123456788"
    },
    {
      id: "mlm",
      name: "1.Care MLM",
      location: "Mawlamyine",
      manager: "Manager MLM",
      contactInfo: "+95 9123456787"
    }
  ]

  console.log("Creating service centers...")
  for (const center of centers) {
    await prisma.serviceCenter.upsert({
      where: { id: center.id },
      update: center,
      create: center,
    })
  }
  console.log("Service centers created!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })