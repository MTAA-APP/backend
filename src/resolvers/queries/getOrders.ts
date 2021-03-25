import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Item, Order, OrderItem, Status } from '.prisma/client'

type Acc = {
  count: number
  price: number
}

interface OrderI extends Order {
  items: ItemI[]
}

interface ItemI extends OrderItem {
  item: Item
}

export default async (req: Request, res: Response) => {
  const orders: OrderI[] = await res.locals.prisma.order.findMany({
    where: {
      service: {
        id: res.locals.user.id,
      },
      status: {
        not: {
          equals: Status.WAITING,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      status: true,
      payment: true,
      createdAt: true,
      completedAt: true,
      customer: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
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
    },
  })

  const data = orders?.map((item: OrderI) => ({
    ...item,
    items: item?.items?.reduce(
      (acc: Acc, curr: ItemI) => {
        acc.count += curr.amount
        acc.price += curr.amount * curr.item.price
        return acc
      },
      { count: 0, price: 0 }
    ),
  }))

  res.status(StatusCodes.OK).json(data)
}
