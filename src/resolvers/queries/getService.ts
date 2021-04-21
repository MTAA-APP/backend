import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Service } from '.prisma/client'

type Params = {
  id: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const service: Service = await res.locals.prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      description: true,
      picture: true,
      phone: true,
      web: true,
      category: true,
      openingHours: {
        select: {
          day: true,
          from: true,
          to: true,
        },
      },
      address: {
        select: {
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
