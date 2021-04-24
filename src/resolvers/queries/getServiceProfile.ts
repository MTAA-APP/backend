import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Service } from '.prisma/client'

export default async (req: Request, res: Response) => {
  const service: Service = await res.locals.prisma.service.findUnique({
    where: { id: res.locals.user.id },
    select: {
      id: true,
      picture: true,
      email: true,
      name: true,
      phone: true,
      web: true,
      address: {
        select: {
          id: true,
          country: true,
          city: true,
          street: true,
          postalCode: true,
        },
      },
    },
  })

  res.status(StatusCodes.OK).json(service)
}
