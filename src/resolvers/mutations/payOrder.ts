import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Order, Status } from '.prisma/client'
import { throwError } from '@/utils/global'

interface CustomerI extends Customer {
  cart: Order
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const customer: CustomerI = await res.locals.prisma.customer.update({
    where: { id: res.locals.user.id },
    data: {
      cart: {
        update: {
          status: Status.READY,
        },
      },
    },
    select: {
      cart: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!customer?.cart) return next(throwError(StatusCodes.NOT_FOUND))

  await res.locals.prisma.customer
    .update({
      where: { id: res.locals.user.id },
      data: {
        cart: {
          disconnect: true,
        },
        orders: {
          connect: {
            id: customer?.cart?.id,
          },
        },
      },
    })
    .then(() => res.status(StatusCodes.OK).json(null))
    .catch(() => res.status(StatusCodes.BAD_REQUEST).json(null))
}
