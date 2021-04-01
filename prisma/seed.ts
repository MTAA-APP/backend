import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { customers, services } from './seedData'

const prisma = new PrismaClient()

const main = async () => {
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash('pass', salt)

  await prisma.$transaction(
    customers?.map((item) =>
      prisma.customer.upsert({
        where: { email: item?.email },
        update: {},
        create: {
          ...item,
          password,
        },
      })
    )
  )

  await prisma.$transaction(
    services?.map((item) =>
      prisma.service.upsert({
        where: { email: item?.email },
        update: {},
        create: {
          ...item,
          password,
        },
      })
    )
  )
}

main()
  .catch((err) => {
    console.log('Seeding error: ', err)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
