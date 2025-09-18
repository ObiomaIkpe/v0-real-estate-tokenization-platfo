"use client"

import { useState } from "react"
import { Search, Filter, MapPin, TrendingUp, Users, Building, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

// Mock data for properties
const properties = [
  {
    id: 1,
    title: "Luxury Downtown Apartment Complex",
    location: "Manhattan, NY",
    image: "/modern-luxury-apartment-building-downtown.jpg",
    progress: 75,
    minInvestment: 1000,
    totalValue: 2500000,
    expectedYield: 8.5,
    tokensSold: 1875,
    totalTokens: 2500,
  },
  {
    id: 2,
    title: "Waterfront Office Building",
    location: "Miami, FL",
    image: "/modern-waterfront-office-building-miami.jpg",
    progress: 45,
    minInvestment: 500,
    totalValue: 1800000,
    expectedYield: 7.2,
    tokensSold: 810,
    totalTokens: 1800,
  },
  {
    id: 3,
    title: "Historic Retail Plaza",
    location: "Boston, MA",
    image: "/historic-retail-plaza-boston-brick-building.jpg",
    progress: 90,
    minInvestment: 250,
    totalValue: 950000,
    expectedYield: 6.8,
    tokensSold: 855,
    totalTokens: 950,
  },
  {
    id: 4,
    title: "Modern Industrial Warehouse",
    location: "Austin, TX",
    image: "/modern-industrial-warehouse-austin-texas.jpg",
    progress: 30,
    minInvestment: 750,
    totalValue: 3200000,
    expectedYield: 9.1,
    tokensSold: 960,
    totalTokens: 3200,
  },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const filteredProperties = properties.filter((property) => {
    return (
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-900" />
                <span className="text-xl font-bold text-slate-900">PropToken</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-blue-900 font-medium">
                  Home
                </Link>
                <Link href="/portfolio" className="text-slate-600 hover:text-blue-900 transition-colors">
                  My Portfolio
                </Link>
                <Link href="/admin" className="text-slate-600 hover:text-blue-900 transition-colors">
                  Admin Dashboard
                </Link>
              </nav>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/submit">
                <Button variant="outline" size="sm">
                  Submit Property
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                Connect Wallet
              </Button>
              <Button size="sm" className="bg-blue-900 hover:bg-blue-800">
                Sign In
              </Button>
            </div>

            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pb-6 border-b">
                      <div className="flex items-center space-x-2">
                        <Building className="h-6 w-6 text-blue-900" />
                        <span className="text-lg font-bold text-slate-900">PropToken</span>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </div>

                    <nav className="flex flex-col space-y-4 py-6">
                      <Link
                        href="/"
                        className="text-blue-900 font-medium text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        href="/portfolio"
                        className="text-slate-600 hover:text-blue-900 transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Portfolio
                      </Link>
                      <Link
                        href="/admin"
                        className="text-slate-600 hover:text-blue-900 transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </nav>

                    <div className="flex flex-col space-y-3 mt-auto pt-6 border-t">
                      <Link href="/submit" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          Submit Property
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full bg-transparent">
                        Connect Wallet
                      </Button>
                      <Button className="w-full bg-blue-900 hover:bg-blue-800">Sign In</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Invest in Real Estate with Blockchain Technology
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto text-pretty">
            Fractional ownership made simple. Invest in premium real estate properties with as little as $250.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
              Start Investing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">$12.5M+</h3>
              <p className="text-slate-600">Total Property Value</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">2,847</h3>
              <p className="text-slate-600">Active Investors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">47</h3>
              <p className="text-slate-600">Properties Listed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-8 bg-slate-50 sticky top-16 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search properties or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                  <SelectItem value="ma">Massachusetts</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000+">$1,000+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Available Properties</h2>
            <p className="text-slate-600">{filteredProperties.length} properties found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-white text-slate-900">
                    {property.expectedYield}% APY
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-2">{property.title}</CardTitle>
                  <div className="flex items-center text-slate-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Funding Progress</span>
                        <span className="font-medium">{property.progress}%</span>
                      </div>
                      <Progress value={property.progress} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">
                        {property.tokensSold.toLocaleString()} / {property.totalTokens.toLocaleString()} tokens sold
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-600">Min. Investment</p>
                        <p className="font-semibold text-slate-900">${property.minInvestment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600">Total Value</p>
                        <p className="font-semibold text-slate-900">${(property.totalValue / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>

                    <Link href={`/property/${property.id}`}>
                      <Button className="w-full bg-blue-900 hover:bg-blue-800">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-6 w-6" />
                <span className="text-lg font-bold">PropToken</span>
              </div>
              <p className="text-slate-400 text-sm">
                Democratizing real estate investment through blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Legal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 PropToken. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
