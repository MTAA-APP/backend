import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Item, Order, OrderItem } from '.prisma/client'

type Acc = {
  count: number
  price: number
}

interface OrderItemI extends OrderItem {
  item: Item
}

interface OrderI extends Order {
  items: [OrderItemI]
}

interface CustomerI extends Customer {
  cart: OrderI
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const customer: CustomerI = await res.locals.prisma.customer.findUnique({
    where: { id: res.locals.user.id },
    include: {
      cart: {
        select: {
          id: true,
          items: {
            select: {
              amount: true,
              item: {
                select: {
                  price: true,
                },
              },
            },
          },
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  const data = {
    ...customer?.cart,
    items: customer?.cart?.items?.reduce(
      (acc: Acc, curr: OrderItemI) => {
        acc.count += curr.amount
        acc.price += curr.amount * curr.item.price
        return acc
      },
      { count: 0, price: 0 }
    ),
  }

  res.status(StatusCodes.OK).json(data)
}
