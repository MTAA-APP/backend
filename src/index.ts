import { PrismaClient } from '@prisma/client'
import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'

import { getUser } from '@/utils/global'
import { corsOptions } from '@/config/cors'
import { errorHandler } from './utils/middleware'
import { auth, services, profile, orders, items, cart } from '@/routes'

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT

app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet())

const middleware = (req: Request, res: Response, next: NextFunction) => {
  const user = getUser(req.headers.authorization)
  res.locals = { prisma, user }
  next()
}

app.use(middleware)

app.use('/', auth)
app.use('/services', services)
app.use('/orders', orders)
app.use('/items', items)
app.use('/cart', cart)
app.use('/profile', profile)

app.use(errorHandler)

app.listen(port, () => console.log(`🚀 Server listening on port ${port}.`))
