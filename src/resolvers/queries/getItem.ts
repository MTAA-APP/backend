import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Item } from '.prisma/client'

type Params = {
  id: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const item: Item = await res.locals.prisma.item.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      picture: true,
      price: true,
      weight: true,
      time: true,
      categories: true,
    },
  })

  res.status(StatusCodes.OK).json(item)
}
