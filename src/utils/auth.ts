import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User } from '@/types/global'

export const checkPassword = async (saved: string, provided: string) =>
  await bcrypt.compare(saved, provided)

export const getPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const getToken = (data: User) =>
  jwt.sign({ ...data }, process.env.TOKEN_SECRET || '', {
    expiresIn: process.env.TOKEN_EXPIRATION,
  })
