const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.visitRequest.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.propertyAmenity.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  // Create Seekers
  const seeker1 = await prisma.user.create({
    data: {
      fullName: 'Alice Seeker',
      email: 'alice@example.com',
      passwordHash,
      role: 'SEEKER',
      phoneNumber: '9876543210'
    }
  })

  // Create Owners
  const owner1 = await prisma.user.create({
    data: {
      fullName: 'Bob Owner',
      email: 'bob@example.com',
      passwordHash,
      role: 'OWNER',
      phoneNumber: '8765432109'
    }
  })

  // Create Properties
  const prop1 = await prisma.property.create({
    data: {
      ownerId: owner1.id,
      title: 'Beautiful 2 BHK in Gachibowli',
      description: 'A spacious and well-lit apartment with modern amenities.',
      propertyType: 'APARTMENT',
      bedroomCount: 2,
      bathroomCount: 2,
      rentAmount: 25000,
      securityDeposit: 50000,
      furnishingStatus: 'SEMI_FURNISHED',
      availableFrom: new Date('2026-09-01'),
      city: 'Hyderabad',
      area: 'Gachibowli',
      locality: 'Financial District',
      address: 'Apt 402, Sunshine Heights, Gachibowli, Hyderabad',
      squareFeet: 1200,
      status: 'AVAILABLE',
      amenities: {
        create: [
          { amenity: 'Parking' },
          { amenity: 'Power Backup' },
          { amenity: 'Security' }
        ]
      }
    }
  })

  const prop2 = await prisma.property.create({
    data: {
      ownerId: owner1.id,
      title: 'Fully Furnished Studio in Kondapur',
      description: 'Ideal for bachelors and working professionals.',
      propertyType: 'STUDIO',
      bedroomCount: 1,
      bathroomCount: 1,
      rentAmount: 15000,
      securityDeposit: 30000,
      furnishingStatus: 'FULLY_FURNISHED',
      availableFrom: new Date('2026-08-30'),
      city: 'Hyderabad',
      area: 'Kondapur',
      locality: 'Whitefields',
      address: 'B-Block, Green View Apartments, Kondapur, Hyderabad',
      squareFeet: 500,
      status: 'AVAILABLE',
      amenities: {
        create: [
          { amenity: 'Wi-Fi' },
          { amenity: 'AC' },
          { amenity: 'Washing Machine' }
        ]
      }
    }
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
