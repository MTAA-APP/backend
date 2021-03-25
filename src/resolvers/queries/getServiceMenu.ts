import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Item } from '.prisma/client'

type Params = {
  id: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const menu: Item[] = await res.locals.prisma.item.findMany({
    where: { service: { id } },
    select: {
      id: true,
      name: true,
      picture: true,
      price: true,
      categories: true,
    },
  })

  res.status(StatusCodes.OK).json(menu)
}
