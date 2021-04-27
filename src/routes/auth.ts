import { Router } from 'express'

import { getMe } from '@/resolvers/queries'
import { signin, customerSignup, serviceSignup } from '@/resolvers/mutations'

const router = Router()

router
  .get('/me', getMe)
  .post('/signin', signin)
  .post('/signup/customer', customerSignup)
  .post('/signup/service', serviceSignup)

export default router
