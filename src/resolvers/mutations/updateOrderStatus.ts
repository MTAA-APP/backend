import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Order, Service, Status } from '.prisma/client'

type Body = {
  id: string
  status: Status
}

interface ServiceI extends Service {
  orders: Order[]
}

export default async (req: Request, res: Response) => {
  const { id, status } = req.body as Body

  await res.locals.prisma.service
    .update({
      where: { id: res.locals.user.id },
      data: {
        orders: {
          update: {
            where: { id },
            data: { status },
          },
        },
      },
      select: {
        orders: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })
    .then((service: ServiceI) =>
      res.status(StatusCodes.OK).json(service?.orders)
    )
    .catch(() => res.status(StatusCodes.NOT_FOUND).json(null))
}
