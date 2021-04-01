import { Router } from 'express'

import { auth, service } from '@/utils/middleware'

import { getOrders, getOrder } from '@/resolvers/queries'
import { updateOrderStatus } from '@/resolvers/mutations'

const router = Router()

router
  .get('/', auth, getOrders)
  .get('/:id', auth, getOrder)
  .put('/status', [auth, service], updateOrderStatus)

export default router
