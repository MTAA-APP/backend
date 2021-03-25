import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Item } from '.prisma/client'

type Query = {
  search: string
}

export default async (req: Request, res: Response) => {
  const { search } = req.query as Query

  const items: Item[] = await res.locals.prisma.item.findMany({
    where: {
      service: {
        id: res.locals.user.id,
      },
      ...(!!search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    },
    select: {
      id: true,
      name: true,
      picture: true,
      price: true,
      categories: true,
    },
  })

  res.status(StatusCodes.OK).json(items)
}
