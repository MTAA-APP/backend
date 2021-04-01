import { Router } from 'express'

import { auth } from '@/utils/middleware'

import { getMe } from '@/resolvers/queries'
import { signin, customerSignup, serviceSignup } from '@/resolvers/mutations'

const router = Router()

router
  .get('/me', auth, getMe)
  .post('/signin', signin)
  .post('/signup/customer', customerSignup)
  .post('/signup/service', serviceSignup)

export default router
