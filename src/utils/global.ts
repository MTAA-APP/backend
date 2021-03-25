import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import createError, { HttpError } from 'http-errors'

import { Customer, Service } from '.prisma/client'
import { Role } from '@/types/enums'

export const getUser = (headerToken?: string) => {
  const token = headerToken?.replace('Bearer ', '')
  const secret = process.env.TOKEN_SECRET || ''

  try {
    return token ? jwt.verify(token, secret) : null
  } catch (err) {
    throw new Error('InvalidTokenError')
  }
}

export const throwError = (
  status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  message?: string
): HttpError => (message ? createError(status, message) : createError(status))

export const getRole = (service: Service, customer: Customer): Role => {
  if (!service && !customer) throw new Error('UnknownRoleError')
  return !!service ? Role.SERVICE : Role.CUSTOMER
}
