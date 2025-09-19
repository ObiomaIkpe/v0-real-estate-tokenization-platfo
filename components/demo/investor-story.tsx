import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, DollarSign, TrendingUp, Users } from "lucide-react"

interface InvestorProfile {
  id: string
  name: string
  location: string
  avatar: string
  investment: number
  tokens: number
  monthlyReturn: number
  joinDate: string
  story: string
}

interface InvestorStoryProps {
  investor: InvestorProfile
  propertyName: string
  propertyLocation: string
}

export function InvestorStory({ investor, propertyName, propertyLocation }: InvestorStoryProps) {
  return (
    <Card className="border-[#2d3748] bg-white">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
            <AvatarFallback className="bg-[#d69e2e] text-white text-lg">
              {investor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-[#2d3748] text-xl">{investor.name}</CardTitle>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{investor.location}</span>
            </div>
            <Badge className="bg-[#d69e2e] text-white mt-2">Investor since {investor.joinDate}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Investment Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-[#d69e2e] mx-auto mb-2" />
            <p className="text-sm text-gray-600">Invested</p>
            <p className="font-bold text-[#2d3748]">${investor.investment.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-6 w-6 text-[#d69e2e] mx-auto mb-2" />
            <p className="text-sm text-gray-600">Tokens Owned</p>
            <p className="font-bold text-[#2d3748]">{investor.tokens}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-[#d69e2e] mx-auto mb-2" />
            <p className="text-sm text-gray-600">Monthly Return</p>
            <p className="font-bold text-green-600">${investor.monthlyReturn}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-6 w-6 text-[#d69e2e] mx-auto mb-2" />
            <p className="text-sm text-gray-600">Property</p>
            <p className="font-bold text-[#2d3748] text-xs">{propertyLocation}</p>
          </div>
        </div>

        {/* Investor Story */}
        <div className="bg-gradient-to-r from-[#2d3748] to-[#4a5568] text-white p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-3">"{investor.name}'s Investment Journey"</h3>
          <p className="text-gray-200 leading-relaxed">{investor.story}</p>
        </div>

        {/* Investment Impact */}
        <div className="border-l-4 border-[#d69e2e] pl-4">
          <h4 className="font-semibold text-[#2d3748] mb-2">Global Impact</h4>
          <p className="text-gray-600 text-sm">
            By investing in {propertyName}, {investor.name} joined {Math.floor(Math.random() * 200) + 50} other global
            investors, democratizing access to premium real estate and creating a truly international investment
            community.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
