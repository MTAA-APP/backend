import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Order } from '.prisma/client'
import { throwError } from '@/utils/global'

interface CustomerI extends Customer {
  cart: Order
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const customer: CustomerI = await res.locals.prisma.customer.findUnique({
    where: { id: res.locals.user.id },
    select: {
      cart: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!customer?.cart) return next(throwError(StatusCodes.NOT_FOUND))

  const deleteItems = res.locals.prisma.orderItem.deleteMany({
    where: {
      orderId: customer?.cart?.id,
    },
  })

  const deleteOrder = res.locals.prisma.order.delete({
    where: {
      id: customer?.cart?.id,
    },
  })

  await res.locals.prisma
    .$transaction([deleteItems, deleteOrder])
    .then(() => res.status(StatusCodes.NO_CONTENT).json(null))
    .catch(() => res.status(StatusCodes.BAD_REQUEST).json(null))
}
