import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Service, ServiceCategory } from '.prisma/client'

interface ServiceI extends Service {
  customers: Customer[]
}

type Query = {
  favorites: string
  search: string
  category: ServiceCategory
}

export default async (req: Request, res: Response) => {
  const { favorites, search, category } = req.query as Query

  const services: ServiceI[] = await res.locals.prisma.service.findMany({
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

  const data = services?.map((item: ServiceI) => ({
    ...item,
    customers: !!item?.customers?.length,
  }))

  res.status(StatusCodes.OK).json(data)
}
