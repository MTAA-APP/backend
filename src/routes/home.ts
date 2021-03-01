import { Router } from 'express'

import { getHome } from '@/resolvers/queries'

const router = Router()

router.get('', getHome)

export default router
