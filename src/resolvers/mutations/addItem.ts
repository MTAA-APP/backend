import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Item, Order, OrderItem, Service } from '.prisma/client'
import { throwError } from '@/utils/global'

type Body = {
  id: string
}

interface ItemI extends Item {
  service: Service
}

interface OrderI extends Order {
  service: Service
  items: Item[]
}

interface CustomerI extends Customer {
  cart: OrderI
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body as Body

  const item: ItemI = await res.locals.prisma.item.findUnique({
    where: { id },
    select: {
      id: true,
      service: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!item) return next(throwError(StatusCodes.NOT_FOUND))

  const customer: CustomerI = await res.locals.prisma.customer.findUnique({
    where: { id: res.locals.user.id },
    select: {
      cart: {
        select: {
          id: true,
          service: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })

  if (!!customer?.cart && item?.service?.id !== customer?.cart?.service?.id)
    return next(throwError(StatusCodes.NOT_ACCEPTABLE))

  const orderItem: OrderItem = await res.locals.prisma.orderItem.findFirst({
    where: {
      item: { id: item?.id },
      order: {
        owner: {
          id: res.locals.user.id,
        },
      },
    },
    select: {
      id: true,
    },
  })

  await res.locals.prisma.order
    .upsert({
      where: { id: customer?.cart?.id || '' },
      create: {
        service: {
          connect: { id: item.service.id },
        },
        owner: {
          connect: { id: res.locals.user.id },
        },
        items: {
          create: {
            item: {
              connect: { id: item.id },
            },
          },
        },
      },
      update: {
        items: {
          upsert: {
            where: { id: orderItem?.id || '' },
            create: {
              item: {
                connect: { id: item.id },
              },
            },
            update: {
              amount: {
                increment: 1,
              },
            },
          },
        },
      },
      select: {
        items: {
          select: {
            id: true,
            amount: true,
            item: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
    .then((cart: OrderI) => res.status(StatusCodes.CREATED).json(cart?.items))
    .catch(() => res.status(StatusCodes.BAD_REQUEST).json(null))
}
