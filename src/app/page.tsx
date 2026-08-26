import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, MapPin, ShieldCheck, Home } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Next Home Without Walking Every Street.
          </h1>
          <p className="text-lg md:text-xl text-slate-300">
            Search top localities, filter by budget, and connect directly with verified owners.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">Find a Home</Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 text-black bg-white hover:bg-slate-100">List Your Property</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Search className="text-primary" /> For House Seekers
              </h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-2"><strong>1.</strong> Search your preferred area</li>
                <li className="flex gap-2"><strong>2.</strong> Filter properties by budget and amenities</li>
                <li className="flex gap-2"><strong>3.</strong> View property details and photos</li>
                <li className="flex gap-2"><strong>4.</strong> Contact the owner directly</li>
                <li className="flex gap-2"><strong>5.</strong> Schedule a visit</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Home className="text-primary" /> For Owners
              </h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-2"><strong>1.</strong> Create an account</li>
                <li className="flex gap-2"><strong>2.</strong> Add your property details</li>
                <li className="flex gap-2"><strong>3.</strong> Upload photos</li>
                <li className="flex gap-2"><strong>4.</strong> Receive enquiries</li>
                <li className="flex gap-2"><strong>5.</strong> Find a tenant quickly</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why RentEase */}
      <section className="bg-slate-100 py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-12">Why use RentEase?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <MapPin className="text-primary h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg">Location-based Discovery</h4>
              <p className="text-slate-600">Find homes exactly where you want to live. No more wandering the streets.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="text-primary h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg">Verified Information</h4>
              <p className="text-slate-600">Get authentic details about the property, rent, and amenities directly from owners.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Home className="text-primary h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg">Direct Owner Contact</h4>
              <p className="text-slate-600">Skip the middleman. Chat with owners and schedule visits seamlessly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
