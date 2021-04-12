import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Service } from '.prisma/client'
import { getRole } from '@/utils/global'
import { User } from '@/types/global'

export default async (req: Request, res: Response) => {
  if (!res?.locals?.user) return res.status(StatusCodes.OK).json(null)

  const getCustomer: Customer = res.locals.prisma.customer.findUnique({
    where: { id: res.locals.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  })

  const getService: Service = res.locals.prisma.service.findUnique({
    where: { id: res.locals.user.id },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  const [customer, service] = await res.locals.prisma.$transaction([
    getCustomer,
    getService,
  ])

  const user: User = {
    ...(customer || service),
    role: getRole(service, customer),
  }

  res.status(StatusCodes.OK).json(user)
}
