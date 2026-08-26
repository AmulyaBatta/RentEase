import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const area = resolvedParams.area as string
  const city = resolvedParams.city as string
  
  let whereClause: any = { status: 'AVAILABLE' }
  if (area) whereClause.area = { contains: area }
  if (city) whereClause.city = { contains: city }

  const properties = await prisma.property.findMany({
    where: whereClause,
    include: {
      images: true,
      amenities: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto p-4 py-8 max-w-7xl flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
          <form className="space-y-4" action="/properties" method="GET">
            <div>
              <label className="text-sm font-medium">Location / Area</label>
              <input type="text" name="area" defaultValue={area} className="mt-1 w-full p-2 border rounded-md" placeholder="e.g. Kondapur" />
            </div>
            <Button type="submit" className="w-full">Apply Filters</Button>
          </form>
        </div>
      </div>

      {/* Property Results */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">
          {properties.length} Properties found {area ? `in ${area}` : ''}
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-200 flex items-center justify-center relative">
                {property.images.length > 0 ? (
                  <img src={property.images[0].imageUrl} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <Home className="h-12 w-12 text-slate-400" />
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold shadow-sm">
                  ₹{property.rentAmount}/mo
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                <div className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {property.locality}, {property.area}
                </div>
                
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-600 border-t pt-4">
                  <div className="font-medium bg-slate-100 px-2 py-1 rounded">
                    {property.bedroomCount} BHK
                  </div>
                  <div className="text-slate-500">
                    {property.furnishingStatus.replace('_', ' ')}
                  </div>
                </div>

                <Link href={`/properties/${property.id}`} className="block mt-4">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {properties.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or searching a different area.</p>
          </div>
        )}
      </div>
    </div>
  )
}
