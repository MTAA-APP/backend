import { Router } from 'express'

import { auth, customer, service } from '@/utils/middleware'

import { getOrders, getOrder, getMyOrders } from '@/resolvers/queries'
import { updateOrderStatus } from '@/resolvers/mutations'

const router = Router()

router
  .get('/', [auth, service], getOrders)
  .get('/history', [auth, customer], getMyOrders)
  .get('/:id', auth, getOrder)
  .put('/status', [auth, service], updateOrderStatus)

export default router
