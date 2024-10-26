// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo/Company Name */}
            <div className="font-bold text-xl">
              CustomsClear Pro
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">
                Services
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Modern Customs Brokerage</span>
              <span className="block text-blue-600">Powered by Technology</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your import & export processes with our tech-driven customs brokerage services. Fast, efficient, and always compliant.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Section */}
          <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="text-lg font-medium text-gray-900">Swift Processing</h3>
                <p className="mt-2 text-gray-600">
                  Automated systems for faster customs clearance
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="text-lg font-medium text-gray-900">Real-time Tracking</h3>
                <p className="mt-2 text-gray-600">
                  Monitor your shipments status 24/7
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="text-lg font-medium text-gray-900">Compliance Assured</h3>
                <p className="mt-2 text-gray-600">
                  Stay compliant with all customs regulations
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}