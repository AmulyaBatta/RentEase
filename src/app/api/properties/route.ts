import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area')
  const city = searchParams.get('city')
  const minRent = searchParams.get('minRent')
  const maxRent = searchParams.get('maxRent')
  const bedroomCount = searchParams.get('bedrooms')
  const furnishingStatus = searchParams.get('furnishing')

  let whereClause: any = { status: 'AVAILABLE' }

  if (area) {
    whereClause.area = { contains: area } // SQLite 'contains' is case-insensitive usually, or requires raw queries for exact match, but this works for basic search
  }
  
  if (city) {
    whereClause.city = { contains: city }
  }

  if (minRent || maxRent) {
    whereClause.rentAmount = {}
    if (minRent) whereClause.rentAmount.gte = parseFloat(minRent)
    if (maxRent) whereClause.rentAmount.lte = parseFloat(maxRent)
  }

  if (bedroomCount) {
    whereClause.bedroomCount = parseInt(bedroomCount)
  }

  if (furnishingStatus) {
    whereClause.furnishingStatus = furnishingStatus
  }

  try {
    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: true,
        amenities: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ properties })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Convert necessary strings to numbers/dates
    const newProperty = await prisma.property.create({
      data: {
        ownerId: session.id,
        title: body.title,
        description: body.description,
        propertyType: body.propertyType,
        bedroomCount: parseInt(body.bedroomCount || '0'),
        bathroomCount: parseInt(body.bathroomCount || '0'),
        rentAmount: parseFloat(body.rentAmount || '0'),
        securityDeposit: parseFloat(body.securityDeposit || '0'),
        furnishingStatus: body.furnishingStatus,
        availableFrom: new Date(body.availableFrom),
        city: body.city,
        area: body.area,
        locality: body.locality,
        address: body.address,
        squareFeet: parseInt(body.squareFeet || '0'),
        status: 'AVAILABLE'
      }
    })

    return NextResponse.json({ property: newProperty })
  } catch (error: any) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
