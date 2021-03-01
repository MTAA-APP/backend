import { PrismaClient } from '@prisma/client'
import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'

import { getUser } from '@/utils/global'
import { corsOptions } from '@/config/cors'
import { home } from '@/routes'

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 4466

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

app.use('/', home)

app.listen(port, () => console.log(`🚀 Server listening on port ${port}.`))
