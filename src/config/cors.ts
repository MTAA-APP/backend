const allowedOrigins: string[] = []

export const corsOptions = {
  credentials: true,

  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins?.includes(origin)) return callback(null, true)

    return callback(new Error('AccessDenied'), false)
  },
}
