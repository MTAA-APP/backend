import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Item, ItemCategory } from '.prisma/client'

type Body = {
  id: string
  picture: string
  name: string
  price: number
  categories: ItemCategory[]
  weight: number
  time: number
  description: string
}

export default async (req: Request, res: Response) => {
  const { id, ...data } = req.body as Body

  await res.locals.prisma.item
    .upsert({
      where: { id },
      update: data,
      create: {
        ...data,
        service: {
          connect: {
            id: res.locals.user.id,
          },
        },
      },
      select: {
        id: true,
        picture: true,
        name: true,
        price: true,
        categories: true,
        weight: true,
        time: true,
        description: true,
      },
    })
    .then((item: Item) => res.status(StatusCodes.CREATED).json(item))
    .catch(() => res.status(StatusCodes.BAD_REQUEST).json(null))
}
