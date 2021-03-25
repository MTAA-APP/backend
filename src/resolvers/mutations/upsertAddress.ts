import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Address } from '.prisma/client'
import { Role } from '@/types/enums'

type Body = {
  id: string
  country: string
  city: string
  street: string
  postalCode: string
}

export default async (req: Request, res: Response) => {
  const { role } = res.locals.user
  const { id, ...data } = req.body as Body

  const address: Address = await res.locals.prisma.address.upsert({
    where: { id },
    update: data,
    create: {
      ...data,
      ...(role === Role.CUSTOMER && {
        customer: {
          connect: {
            id: res.locals.user.id,
          },
        },
      }),
      ...(role === Role.SERVICE && {
        service: {
          connect: {
            id: res.locals.user.id,
          },
        },
      }),
    },
    select: {
      id: true,
      country: true,
      city: true,
      street: true,
      postalCode: true,
    },
  })

  res.status(StatusCodes.CREATED).json(address)
}
