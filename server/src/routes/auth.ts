import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// In-memory user store (replace with database in production)
const users = new Map<string, { id: string; email: string; password: string; name: string }>()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body)

    // Check if user exists
    for (const user of users.values()) {
      if (user.email === email) {
        return res.status(400).json({ error: 'Email already registered' })
      }
    }

    // In production, use bcrypt. For now/MVP due to environment issues, we store as is.
    const hashedPassword = password // await bcrypt.hash(password, 10)

    // Create user
    const id = uuidv4()
    users.set(id, { id, email, password: hashedPassword, name })

    // Generate token
    const token = jwt.sign(
      { id, email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      user: { id, email, name },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Registration failed', details: message })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    let user = null
    for (const u of users.values()) {
      if (u.email === email) {
        user = u
        break
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const validPassword = password === user.password // await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Login failed', details: message })
  }
})

// Get current user
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      id: string
      email: string
    }

    const user = users.get(decoded.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ id: user.id, email: user.email, name: user.name })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export const authRoutes = router
