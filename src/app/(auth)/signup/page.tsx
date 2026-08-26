'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('SEEKER')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('fullName')
    const email = formData.get('email')
    const phoneNumber = formData.get('phoneNumber')
    const password = formData.get('password')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phoneNumber, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Signup failed')
      } else {
        toast.success('Account created successfully')
        if (data.role === 'SEEKER') router.push('/seeker/dashboard')
        else if (data.role === 'OWNER') router.push('/owner/dashboard')
        
        router.refresh()
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Join RentEase to find or list your property</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEEKER">House Seeker</SelectItem>
                  <SelectItem value="OWNER">House Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" required placeholder="+91 9876543210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <div className="text-sm text-center text-slate-500">
              Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
