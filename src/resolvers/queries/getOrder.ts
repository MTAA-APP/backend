import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Order, Status } from '.prisma/client'

type Params = {
  id: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const order: Order = await res.locals.prisma.order.findUnique({
    where: {
      id,
      status: {
        not: {
          equals: Status.WAITING,
        },
      },
      service: {
        id: res.locals.user.id,
      },
    },
    select: {
      id: true,
      status: true,
      payment: true,
      createdAt: true,
      completedAt: true,
      items: {
        select: {
          id: true,
          amount: true,
          item: {
            select: {
              id: true,
              name: true,
              price: true,
              time: true,
              weight: true,
              categories: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: {
            select: {
              country: true,
              city: true,
              street: true,
              postalCode: true,
            },
          },
        },
      },
    },
  })

  res.status(StatusCodes.OK).json(order)
}
