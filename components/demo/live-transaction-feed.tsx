"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownRight, Vote, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface LiveTransaction {
  id: string
  type: "purchase" | "dividend" | "governance" | "rental"
  investor: string
  location: string
  amount?: number
  tokens?: number
  property: string
  timestamp: Date
  description: string
}

export function LiveTransactionFeed() {
  const [transactions, setTransactions] = useState<LiveTransaction[]>([])

  // Mock live transaction data
  const mockTransactions: LiveTransaction[] = [
    {
      id: "1",
      type: "purchase",
      investor: "Sarah K.",
      location: "Lagos, Nigeria",
      amount: 500,
      tokens: 25,
      property: "Miami Luxury Condo",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      description: "Purchased 25 tokens",
    },
    {
      id: "2",
      type: "dividend",
      investor: "Chen W.",
      location: "Singapore",
      amount: 127,
      property: "NYC Apartment Complex",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      description: "Received monthly dividend",
    },
    {
      id: "3",
      type: "governance",
      investor: "Maria G.",
      location: "São Paulo, Brazil",
      property: "London Office Building",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      description: "Voted on property upgrade proposal",
    },
    {
      id: "4",
      type: "rental",
      investor: "System",
      location: "Miami, USA",
      amount: 5200,
      property: "Miami Luxury Condo",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      description: "Monthly rental income deposited",
    },
    {
      id: "5",
      type: "purchase",
      investor: "Ahmed R.",
      location: "Dubai, UAE",
      amount: 1200,
      tokens: 60,
      property: "Tokyo Residential Tower",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      description: "Purchased 60 tokens",
    },
  ]

  useEffect(() => {
    setTransactions(mockTransactions)

    // Simulate live updates
    const interval = setInterval(() => {
      const newTransaction: LiveTransaction = {
        id: Date.now().toString(),
        type: ["purchase", "dividend", "governance", "rental"][Math.floor(Math.random() * 4)] as any,
        investor: ["Alex M.", "Priya S.", "João P.", "Emma L.", "Yuki T."][Math.floor(Math.random() * 5)],
        location: ["London, UK", "Mumbai, India", "Toronto, Canada", "Berlin, Germany", "Sydney, Australia"][
          Math.floor(Math.random() * 5)
        ],
        amount: Math.floor(Math.random() * 2000) + 100,
        tokens: Math.floor(Math.random() * 100) + 10,
        property: ["Miami Luxury Condo", "NYC Apartment Complex", "London Office Building", "Tokyo Residential Tower"][
          Math.floor(Math.random() * 4)
        ],
        timestamp: new Date(),
        description: "New transaction",
      }

      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)])
    }, 15000) // New transaction every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case "dividend":
        return <DollarSign className="h-4 w-4 text-[#d69e2e]" />
      case "governance":
        return <Vote className="h-4 w-4 text-blue-600" />
      case "rental":
        return <ArrowUpRight className="h-4 w-4 text-purple-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-green-100 text-green-800"
      case "dividend":
        return "bg-yellow-100 text-yellow-800"
      case "governance":
        return "bg-blue-100 text-blue-800"
      case "rental":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card className="border-[#2d3748] bg-white">
      <CardHeader>
        <CardTitle className="text-[#2d3748] flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          Live Global Activity
        </CardTitle>
        <p className="text-sm text-gray-600">Real-time transactions from investors worldwide</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">{getTransactionIcon(transaction.type)}</div>

              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-[#d69e2e] text-white text-xs">
                  {transaction.investor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[#2d3748] text-sm">{transaction.investor}</span>
                  <Badge className={`text-xs ${getTransactionColor(transaction.type)}`}>{transaction.type}</Badge>
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {transaction.location} • {transaction.property}
                </p>
                {transaction.amount && (
                  <p className="text-xs font-medium text-[#d69e2e]">
                    ${transaction.amount.toLocaleString()}
                    {transaction.tokens && ` (${transaction.tokens} tokens)`}
                  </p>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500">{formatTimeAgo(transaction.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
