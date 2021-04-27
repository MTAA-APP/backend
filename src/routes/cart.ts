import { Router } from 'express'

import { auth, customer } from '@/utils/middleware'

import { getCart, getCartInfo } from '@/resolvers/queries'
import {
  addItem,
  payOrder,
  removeItem,
  removeCart,
} from '@/resolvers/mutations'

const router = Router()

router
  .get('/', [auth, customer], getCart)
  .get('/info', [auth, customer], getCartInfo)
  .post('/', [auth, customer], addItem)
  .delete('/:id', [auth, customer], removeItem)
  .put('/pay', [auth, customer], payOrder)
  .delete('/', [auth, customer], removeCart)

export default router
