import { Router } from 'express'

import { auth, customer, service } from '@/utils/middleware'

import { getCustomerProfile, getServiceProfile } from '@/resolvers/queries'
import {
  updateCustomerProfile,
  updateServiceProfile,
  upsertAddress,
} from '@/resolvers/mutations'

const router = Router()

router
  .get('/customer', [auth, customer], getCustomerProfile)
  .get('/service', [auth, service], getServiceProfile)
  .put('/customer', [auth, customer], updateCustomerProfile)
  .put('/service', [auth, service], updateServiceProfile)
  .post('/address', auth, upsertAddress)

export default router
