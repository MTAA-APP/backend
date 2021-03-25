import { Router } from 'express'

import { auth, customer } from '@/utils/middleware'

import { getCart } from '@/resolvers/queries'
import { addItem, payOrder, removeItem } from '@/resolvers/mutations'

const router = Router()

router
  .get('/', [auth, customer], getCart)
  .post('/', [auth, customer], addItem)
  .delete('/:id', [auth, customer], removeItem)
  .put('/pay', [auth, customer], payOrder)

export default router
