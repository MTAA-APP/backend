import { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  res.json({ info: 'REST API', version: 1, authors: ['xskriba', 'xcaplak'] })
}
