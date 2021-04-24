import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer } from '.prisma/client'

export default async (req: Request, res: Response, next: NextFunction) => {
  const customer: Customer = await res.locals.prisma.customer.findUnique({
    where: { id: res.locals.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      payment: true,
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

  res.status(StatusCodes.OK).json(customer)
}
