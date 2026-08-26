import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Eye, MessageSquare, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function OwnerDashboard() {
  const session = await getSession()
  
  const stats = {
    activeListings: await prisma.property.count({ where: { ownerId: session?.id, status: 'AVAILABLE' } }),
    visits: await prisma.visitRequest.count({ where: { ownerId: session?.id } }),
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <Link href="/owner/properties/new">
          <Button>Add New Property</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visit Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Enquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
        <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-slate-200">
          <Home className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          {stats.activeListings === 0 ? (
            <>
              <h3 className="text-lg font-medium text-slate-900">No properties listed yet</h3>
              <p className="text-slate-500 mt-2 mb-4">List your first property and start receiving enquiries.</p>
              <Link href="/owner/properties/new">
                <Button>List a Property</Button>
              </Link>
            </>
          ) : (
            <div className="text-left">
              <Link href="/owner/properties">
                <Button variant="outline">View All Properties</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
