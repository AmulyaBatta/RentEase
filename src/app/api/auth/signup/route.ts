import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phoneNumber, password, role } = body

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (role !== 'SEEKER' && role !== 'OWNER') {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phoneNumber,
        passwordHash,
        role,
      },
    })

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.fullName
    })

    return NextResponse.json({ success: true, role: user.role })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
