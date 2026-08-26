import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Home, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react'
import { RequestVisitButton } from '@/components/shared/RequestVisitButton'

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: {
        select: { fullName: true, email: true, phoneNumber: true }
      },
      amenities: true,
      images: true,
    }
  })

  if (!property) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-5xl">
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{property.address}, {property.locality}, {property.area}, {property.city}</span>
            </div>
          </div>

          <div className="h-64 sm:h-96 bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
            {property.images.length > 0 ? (
              <img src={property.images[0].imageUrl} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <Home className="h-20 w-20 text-slate-400" />
            )}
          </div>

          <div className="flex flex-wrap gap-4 py-4 border-y">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
              <span className="font-medium">{property.bedroomCount} BHK</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
              <Home className="h-5 w-5 text-slate-600" />
              <span className="font-medium">{property.propertyType}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
              <span className="font-medium">{property.furnishingStatus.replace('_', ' ')}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{property.description || 'No description provided.'}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {a.amenity}
                </div>
              ))}
              {property.amenities.length === 0 && <span className="text-slate-500">No amenities listed.</span>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-1">
                ₹{property.rentAmount} <span className="text-sm font-normal text-slate-500">/ month</span>
              </div>
              <div className="text-sm text-slate-500 mb-6">
                Security Deposit: ₹{property.securityDeposit}
              </div>

              <div className="space-y-4">
                <Button className="w-full text-lg h-12">Contact Owner</Button>
                <RequestVisitButton 
                  propertyId={property.id} 
                  ownerId={property.ownerId} 
                  isSeeker={session?.role === 'SEEKER'} 
                />
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                    {property.owner.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{property.owner.fullName}</h3>
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <ShieldCheck className="h-4 w-4 mr-1" /> Verified Owner
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Available from: {new Date(property.availableFrom).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
