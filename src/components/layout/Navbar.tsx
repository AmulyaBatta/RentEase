import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { LogoutButton } from './LogoutButton'

export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Home className="h-6 w-6" />
          <span>RentEase</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {session.role === 'SEEKER' && (
                <Link href="/seeker/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              {session.role === 'OWNER' && (
                <Link href="/owner/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
