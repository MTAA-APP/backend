import { Router } from 'express'

import { auth, service } from '@/utils/middleware'

import { getItems, getItem } from '@/resolvers/queries'
import { createItem, deleteItem } from '@/resolvers/mutations'

const router = Router()

router
  .get('/', [auth, service], getItems)
  .post('/', [auth, service], createItem)
  .get('/:id', getItem)
  .delete('/:id', [auth, service], deleteItem)

export default router
