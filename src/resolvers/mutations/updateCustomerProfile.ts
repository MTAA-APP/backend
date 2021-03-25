import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Payment } from '.prisma/client'

type Body = {
  firstName: string
  lastName: string
  phone: string
  payment: Payment
}

export default async (req: Request, res: Response) => {
  const data: Body = req.body as Body

  const customer: Customer = await res.locals.prisma.customer.update({
    where: { id: res.locals.user.id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      payment: true,
    },
  })

  res.status(StatusCodes.OK).json(customer)
}
