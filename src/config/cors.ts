const allowedOrigins = [
  process.env.DOCUMENTATION_URL,
  process.env.LOCALHOST_URL,
]

export const corsOptions = {
  credentials: true,

  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins?.includes(origin)) return callback(null, true)

    return callback(new Error('AccessDenied'), false)
  },
}
