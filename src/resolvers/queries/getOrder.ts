import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Item, Order, OrderItem } from '.prisma/client'

type Params = {
  id: string
}

type Acc = {
  count: number
  price: number
}

interface OrderItemI extends OrderItem {
  item: Item
}

interface OrderI extends Order {
  items: OrderItemI[]
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const order: OrderI = await res.locals.prisma.order.findUnique({
    where: {
      id,
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

  const data = {
    ...order,
    total: order?.items?.reduce(
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
