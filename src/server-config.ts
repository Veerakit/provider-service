import cors from 'cors'
import express, { json } from 'express'

const CURRENT_PORT = 3000

const server = express()

server.use(
  cors({
    origin: `http://localhost:${CURRENT_PORT}`
  })
)

server.use(json())
server.get('/', (_: any, res: any): void => {
  res.status(200).json({ message: `server is running at port ${CURRENT_PORT}` })
})

server.use('/auth/fake-token', (_: any, res: any) => {
  const token = `Bearer ${new Date().toISOString()}`
  return res.status(200).json({ token, status: 200 })
})

export { server }
