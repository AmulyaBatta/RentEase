import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Heart, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SeekerDashboard() {
  const session = await getSession()
  
  const stats = {
    favorites: await prisma.favorite.count({ where: { seekerId: session?.id } }),
    visits: await prisma.visitRequest.count({ where: { seekerId: session?.id } }),
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {session?.name}</h1>
        <Link href="/properties">
          <Button>Find Properties</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favorites}</div>
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
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Search</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-4">Ready to find your next home?</p>
          <form action="/properties" method="GET" className="flex gap-4">
            <input 
              type="text" 
              name="area"
              placeholder="Search area, locality, city..." 
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
