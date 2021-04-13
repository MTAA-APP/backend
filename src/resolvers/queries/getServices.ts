import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Service, ServiceCategory } from '.prisma/client'

type Query = {
  favorites: string
  search: string
  category: ServiceCategory
}

export default async (req: Request, res: Response) => {
  const { favorites, search, category } = req.query as Query

  const services: Service[] = await res.locals.prisma.service.findMany({
    where: {
      ...(!!search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(!!category && {
        category: {
          equals: category,
        },
      }),
      ...(!!favorites && {
        customers: {
          some: {
            id: res.locals.user.id,
          },
        },
      }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      picture: true,
      category: true,
      customers: {
        where: {
          id: res?.locals?.user?.id,
        },
        select: {
          id: true,
        },
      },
    },
  })

  res.status(StatusCodes.OK).json(services)
}
