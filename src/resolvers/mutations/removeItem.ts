import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { OrderItem } from '.prisma/client'
import { throwError } from '@/utils/global'

type Params = {
  id: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as Params

  const item: OrderItem = await res.locals.prisma.orderItem.findUnique({
    where: { id },
  })

  if (!item) return next(throwError(StatusCodes.NOT_FOUND))

  const orderItem: OrderItem = await res.locals.prisma.orderItem.update({
    where: { id },
    data: {
      amount: {
        decrement: 1,
      },
    },
    select: {
      id: true,
      amount: true,
    },
  })

  if (orderItem?.amount <= 0)
    await res.locals.prisma.orderItem.delete({
      where: { id },
    })

  res.status(StatusCodes.NO_CONTENT).json(null)
}
