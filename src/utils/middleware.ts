import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { HttpError } from 'http-errors'

import { throwError } from '@/utils/global'
import { Role } from '@/types/enums'

export const errorHandler = (
  err: HttpError,
  _: Request,
  res: Response,
  __: NextFunction
) => res.status(err.statusCode).json(null)

export const auth = (_: Request, res: Response, next: NextFunction) => {
  if (!res?.locals?.user) return next(throwError(StatusCodes.UNAUTHORIZED))
  next()
}

export const customer = (_: Request, res: Response, next: NextFunction) => {
  if (res?.locals?.user?.role !== Role.CUSTOMER)
    return next(throwError(StatusCodes.FORBIDDEN))
  next()
}

export const service = (_: Request, res: Response, next: NextFunction) => {
  if (res?.locals?.user?.role !== Role.SERVICE)
    return next(throwError(StatusCodes.FORBIDDEN))
  next()
}
