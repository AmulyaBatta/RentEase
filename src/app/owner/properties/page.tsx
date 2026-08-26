import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OwnerPropertiesPage() {
  const session = await getSession()
  if (!session || session.role !== 'OWNER') {
    redirect('/login')
  }

  const properties = await prisma.property.findMany({
    where: { ownerId: session.id },
    include: {
      images: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Properties</h1>
        <Link href="/owner/properties/new">
          <Button>Add New Property</Button>
        </Link>
      </div>

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
                {property.status}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
              <div className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {property.locality}, {property.area}
              </div>
              
              <div className="mt-4 text-sm font-semibold">
                ₹{property.rentAmount} / month
              </div>

              <Link href={`/properties/${property.id}`} className="block mt-4">
                <Button variant="outline" className="w-full">View Public Page</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        
        {properties.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Home className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-slate-500 mt-2">You haven't added any properties yet.</p>
            <Link href="/owner/properties/new" className="mt-4 inline-block">
              <Button>List a Property</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
