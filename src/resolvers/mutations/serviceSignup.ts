import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Service, ServiceCategory } from '.prisma/client'

import { getPassword, getToken } from '@/utils/auth'
import { throwError } from '@/utils/global'
import { User } from '@/types/global'
import { Role } from '@/types/enums'

type Body = {
  name: string
  category: ServiceCategory
  email: string
  password: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { password, ...data } = req.body as Body

  const hashedPassword = await getPassword(password)

  await res.locals.prisma.service
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
    .then((service: Service) => {
      const user: User = {
        ...service,
        role: Role.SERVICE,
      }

      const token: string = getToken(user)

      res.status(StatusCodes.OK).json({ user, token })
    })
    .catch(() => next(throwError(StatusCodes.BAD_REQUEST)))
}
