import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'SEEKER') {
    return NextResponse.json({ error: 'Only house seekers can request visits' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { propertyId, ownerId, visitDate, preferredTime, message } = body

    if (!propertyId || !ownerId || !visitDate || !preferredTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newVisit = await prisma.visitRequest.create({
      data: {
        propertyId,
        seekerId: session.id,
        ownerId,
        visitDate: new Date(visitDate),
        preferredTime,
        message,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ visit: newVisit })
  } catch (error) {
    console.error('Error requesting visit:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
