"use client"

import { useState } from "react"
import { Search, Filter, MapPin, TrendingUp, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/favicon.ico" alt="REALiFi Logo" width={32} height={32} className="h-8 w-8" />
                <span className="text-xl font-bold text-foreground">REALiFi</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-primary font-medium">
                  Home
                </Link>
                <Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">
                  My Portfolio
                </Link>
                <Link href="/governance" className="text-muted-foreground hover:text-primary transition-colors">
                  Governance
                </Link>
                <Link href="/demo" className="text-muted-foreground hover:text-primary transition-colors">
                  Live Demo
                </Link>
                <Link href="/escrow" className="text-muted-foreground hover:text-primary transition-colors">
                  Smart Escrow
                </Link>
                <Link href="/compliance" className="text-muted-foreground hover:text-primary transition-colors">
                  Compliance
                </Link>
                <Link href="/insurance" className="text-muted-foreground hover:text-primary transition-colors">
                  Insurance
                </Link>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
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
              <Button size="sm" className="bg-primary hover:bg-primary/90">
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
                        <Image src="/favicon.ico" alt="REALiFi Logo" width={24} height={24} className="h-6 w-6" />
                        <span className="text-lg font-bold text-foreground">REALiFi</span>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </div>

                    <nav className="flex flex-col space-y-4 py-6">
                      <Link
                        href="/"
                        className="text-primary font-medium text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        href="/portfolio"
                        className="text-muted-foreground hover:text-primary transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Portfolio
                      </Link>
                      <Link
                        href="/governance"
                        className="text-muted-foreground hover:text-primary transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Governance
                      </Link>
                      <Link
                        href="/demo"
                        className="text-muted-foreground hover:text-primary transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Live Demo
                      </Link>
                      <Link
                        href="/escrow"
                        className="text-muted-foreground hover:text-primary transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Smart Escrow
                      </Link>
                      <Link
                        href="/compliance"
                        className="text-muted-foreground hover:text-primary transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Compliance
                      </Link>
                      <Link
                        href="/insurance"
                        className="text-muted-foreground hover:text-primary transition-colors text-lg py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Insurance
                      </Link>
                      <Link
                        href="/admin"
                        className="text-muted-foreground hover:text-primary transition-colors text-lg py-2"
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
                      <Button className="w-full bg-primary hover:bg-primary/90">Sign In</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Invest in Real Estate with Blockchain Technology
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 max-w-3xl mx-auto text-pretty">
            Fractional ownership made simple. Invest in premium real estate properties with as little as $250.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Start Investing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">$12.5M+</h3>
              <p className="text-muted-foreground">Total Property Value</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">2,847</h3>
              <p className="text-muted-foreground">Active Investors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <Image src="/favicon.ico" alt="REALiFi Logo" width={32} height={32} className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">47</h3>
              <p className="text-muted-foreground">Properties Listed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-8 bg-muted sticky top-16 z-40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2d3748] h-4 w-4" />
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
                <Filter className="h-4 w-4 mr-2 text-[#2d3748]" />
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
            <h2 className="text-3xl font-bold text-foreground">Available Properties</h2>
            <p className="text-muted-foreground">{filteredProperties.length} properties found</p>
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
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                    {property.expectedYield}% APY
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">{property.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-[#2d3748]" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-medium">{property.progress}%</span>
                      </div>
                      <Progress value={property.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {property.tokensSold.toLocaleString()} / {property.totalTokens.toLocaleString()} tokens sold
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Min. Investment</p>
                        <p className="font-semibold text-foreground">${property.minInvestment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Value</p>
                        <p className="font-semibold text-foreground">${(property.totalValue / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>

                    <Link href={`/property/${property.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/favicon.ico" alt="REALiFi Logo" width={24} height={24} className="h-6 w-6" />
                <span className="text-lg font-bold">REALiFi</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">
                Democratizing real estate investment through blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    Legal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/70">
            <p>&copy; 2024 REALiFi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
