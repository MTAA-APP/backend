import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Service } from '.prisma/client'

type Body = {
  picture: string
  name: string
  phone: string
  web: string
}

export default async (req: Request, res: Response) => {
  const data: Body = req.body as Body

  const service: Service = await res.locals.prisma.service.update({
    where: { id: res.locals.user.id },
    data,
    select: {
      id: true,
      picture: true,
      name: true,
      phone: true,
      web: true,
    },
  })

  res.status(StatusCodes.OK).json(service)
}
