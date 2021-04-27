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
      customer: {
        id: res.locals.user.id,
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
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      items: {
        select: {
          id: true,
          amount: true,
          item: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  })

  const itemsData = orders?.map((item: OrderI) => ({
    ...item,
    items: item?.items?.map((item2: ItemI) => ({
      ...item2,
      total: item2?.amount * item2?.item?.price,
    })),
  }))

  const data = itemsData?.map((item: OrderI) => ({
    ...item,
    total: item?.items?.reduce(
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
