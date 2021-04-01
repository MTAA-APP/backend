import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

type Params = {
  id: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  await res.locals.prisma.customer
    .update({
      where: { id: res.locals.user.id },
      data: {
        favorites: {
          disconnect: { id },
        },
      },
    })
    .then(() => res.status(StatusCodes.NO_CONTENT).json(null))
    .catch(() => res.status(StatusCodes.NOT_FOUND).json(null))
}
