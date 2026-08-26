'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AddPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [propertyType, setPropertyType] = useState('APARTMENT')
  const [furnishingStatus, setFurnishingStatus] = useState('UNFURNISHED')
  const [bhkType, setBhkType] = useState('1')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    data.propertyType = propertyType
    data.furnishingStatus = furnishingStatus
    data.bedroomCount = bhkType
    data.bathroomCount = bhkType // Fallback to avoid schema errors

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error || 'Failed to list property')
      } else {
        toast.success('Property listed successfully')
        router.push('/owner/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>List Your Property</CardTitle>
          <CardDescription>Add details about your property to find tenants.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Property Title</Label>
                  <Input name="title" required placeholder="e.g. Beautiful 2 BHK in Kondapur" />
                </div>
                
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={propertyType} onValueChange={(value) => setPropertyType(value as string)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="HOUSE">Independent House</SelectItem>
                      <SelectItem value="VILLA">Villa</SelectItem>
                      <SelectItem value="PG">PG</SelectItem>
                      <SelectItem value="SINGLE_ROOM">Single Room</SelectItem>
                      <SelectItem value="SHARED_ROOM">Shared Room</SelectItem>
                      <SelectItem value="STUDIO">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Furnishing</Label>
                  <Select value={furnishingStatus} onValueChange={(value) => setFurnishingStatus(value as string)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULLY_FURNISHED">Fully Furnished</SelectItem>
                      <SelectItem value="SEMI_FURNISHED">Semi-Furnished</SelectItem>
                      <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>BHK Type</Label>
                  <Select value={bhkType} onValueChange={(value) => setBhkType(value as string)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">4+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Area (Sq.Ft)</Label>
                  <Input name="squareFeet" type="number" min="0" />
                </div>

                <div className="space-y-2">
                  <Label>Monthly Rent (₹)</Label>
                  <Input name="rentAmount" type="number" required min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit (₹)</Label>
                  <Input name="securityDeposit" type="number" required min="0" />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Available From</Label>
                  <Input name="availableFrom" type="date" required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Location</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input name="city" required placeholder="Hyderabad" />
                </div>
                <div className="space-y-2">
                  <Label>Area</Label>
                  <Input name="area" required placeholder="Gachibowli" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Locality</Label>
                  <Input name="locality" required placeholder="Financial District, near Wipro circle" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Full Address</Label>
                  <Textarea name="address" required placeholder="Apartment name, street, landmark..." />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Description</h3>
              <div className="space-y-2">
                <Textarea name="description" placeholder="Tell potential tenants about the property, nearby facilities, and rules..." className="h-32" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
