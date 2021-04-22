import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export default async (req: Request, res: Response) => {
  await res.locals.prisma.customer
    .update({
      where: { id: res.locals.user.id },
      data: {
        cart: {
          delete: true,
        },
      },
    })
    .then(() => res.status(StatusCodes.NO_CONTENT).json(null))
    .catch(() => res.status(StatusCodes.NOT_FOUND).json(null))
}
