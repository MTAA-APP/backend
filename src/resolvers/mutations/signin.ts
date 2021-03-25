import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer, Service } from '.prisma/client'
import { checkPassword, getToken } from '@/utils/auth'
import { getRole, throwError } from '@/utils/global'
import { Role } from '@/types/enums'

type Body = {
  email: string
  password: string
}

type User = {
  id: string
  email: string
  role: Role
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as Body

  const getCustomer: Customer = res.locals.prisma.customer.findUnique({
    where: { email },
  })

  const getService: Service = res.locals.prisma.service.findUnique({
    where: { email },
  })

  const [customer, service] = await res.locals.prisma.$transaction([
    getCustomer,
    getService,
  ])

  if (!service && !customer) return next(throwError(StatusCodes.NOT_FOUND))

  const user: User = {
    id: customer?.id || service?.id,
    email: customer?.email || service?.email,
    role: getRole(service, customer),
  }

  const passwordMatch = await checkPassword(
    password,
    customer?.password || service?.password
  )

  if (!passwordMatch) return next(throwError(StatusCodes.UNAUTHORIZED))

  const token: string = getToken(user)

  res.status(StatusCodes.OK).json({ user, token })
}
