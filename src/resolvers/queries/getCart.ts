import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Order } from '.prisma/client'

interface CustomerI extends Customer {
  cart: Order
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const customer: CustomerI = await res.locals.prisma.customer.findUnique({
    where: { id: res.locals.user.id },
    include: {
      cart: {
        select: {
          id: true,
          payment: true,
          status: true,
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
                  picture: true,
                  price: true,
                  categories: true,
                },
              },
            },
          },
          service: {
            id: true,
            name: true,
          },
          owner: {
            select: {
              payment: true,
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
      },
    },
  })

  res.status(StatusCodes.OK).json(customer?.cart)
}
