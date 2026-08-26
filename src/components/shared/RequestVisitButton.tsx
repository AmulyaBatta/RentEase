'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface RequestVisitButtonProps {
  propertyId: string
  ownerId: string
  isSeeker: boolean
}

export function RequestVisitButton({ propertyId, ownerId, isSeeker }: RequestVisitButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!isSeeker) {
      toast.error('You need to be logged in as a Seeker to request a visit.')
      router.push('/login')
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          ownerId,
          visitDate: formData.get('visitDate'),
          preferredTime: formData.get('preferredTime'),
          message: formData.get('message')
        })
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to request visit')
      } else {
        toast.success('Visit requested successfully! The owner will be notified.')
        setOpen(false)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-lg h-12">Request Visit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a Visit</DialogTitle>
          <DialogDescription>Let the owner know when you'd like to see the property.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input name="visitDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label>Preferred Time</Label>
            <Input name="preferredTime" type="time" required />
          </div>
          <div className="space-y-2">
            <Label>Message (Optional)</Label>
            <Textarea name="message" placeholder="Hi, I'm interested in..." />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
