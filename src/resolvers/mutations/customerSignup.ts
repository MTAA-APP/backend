import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Customer } from '.prisma/client'
import { getPassword, getToken } from '@/utils/auth'
import { throwError } from '@/utils/global'
import { User } from '@/types/global'
import { Role } from '@/types/enums'

type Body = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { password, ...data } = req.body as Body

  const hashedPassword = await getPassword(password)

  await res.locals.prisma.customer
    .create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    })
    .then((customer: Customer) => {
      const user: User = {
        ...customer,
        role: Role.CUSTOMER,
      }

      const token: string = getToken(user)

      res.status(StatusCodes.CREATED).json({ user, token })
    })
    .catch(() => next(throwError(StatusCodes.BAD_REQUEST)))
}
