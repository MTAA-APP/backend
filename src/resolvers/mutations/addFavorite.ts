import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

type Body = {
  id: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.body as Body

  await res.locals.prisma.customer
    .update({
      where: { id: res.locals.user.id },
      data: {
        favorites: {
          connect: { id },
        },
      },
    })
    .then(() => res.status(StatusCodes.NO_CONTENT).json(null))
    .catch(() => res.status(StatusCodes.NOT_FOUND).json(null))
}
