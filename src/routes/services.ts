import { Router } from 'express'

import { auth, customer } from '@/utils/middleware'

import { getServices, getService, getServiceMenu } from '@/resolvers/queries'
import { addFavorite, removeFavorite } from '@/resolvers/mutations'

const router = Router()

router
  .get('/', [auth, customer], getServices)
  .get('/:id', getService)
  .get('/:id/menu', getServiceMenu)
  .put('/favorite', [auth, customer], addFavorite)
  .delete('/:id', [auth, customer], removeFavorite)

export default router
