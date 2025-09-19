"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { EscrowAccount, EscrowTransaction } from "@/lib/escrow/smart-escrow"
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface EscrowDashboardProps {
  escrowAccount: EscrowAccount
  transactions: EscrowTransaction[]
  onDistributeDividends: () => void
  onDistributeFees: () => void
}

export function EscrowDashboard({
  escrowAccount,
  transactions,
  onDistributeDividends,
  onDistributeFees,
}: EscrowDashboardProps) {
  const recentTransactions = transactions.slice(0, 5)
  const nextDistribution = new Date(escrowAccount.lastDistribution)
  nextDistribution.setMonth(nextDistribution.getMonth() + 1)

  const daysUntilDistribution = Math.ceil((nextDistribution.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case "withdrawal":
      case "fee_distribution":
      case "dividend_distribution":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTransactionType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-6">
      {/* Escrow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-[#2d3748]">${escrowAccount.balance.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Distributed</p>
                <p className="text-2xl font-bold text-[#2d3748]">${escrowAccount.totalDistributed.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Management Fee</p>
                <p className="text-2xl font-bold text-[#2d3748]">{escrowAccount.managementFeeRate}%</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Distribution</p>
                <p className="text-2xl font-bold text-[#2d3748]">{daysUntilDistribution}d</p>
              </div>
              <Calendar className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onDistributeFees}
          className="bg-[#2d3748] hover:bg-[#1a202c] text-white"
          disabled={escrowAccount.balance <= 0}
        >
          Distribute Fees
        </Button>
        <Button
          onClick={onDistributeDividends}
          className="bg-[#d69e2e] hover:bg-[#b7791f] text-white"
          disabled={escrowAccount.balance <= 0}
        >
          Distribute Dividends
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card className="border-[#2d3748]">
        <CardHeader>
          <CardTitle className="text-[#2d3748]">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-[#2d3748]">{formatTransactionType(transaction.type)}</p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                      {transaction.recipient && <p className="text-xs text-gray-500">To: {transaction.recipient}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.timestamp.toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">No transactions yet</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fee Structure */}
      <Card className="border-[#2d3748]">
        <CardHeader>
          <CardTitle className="text-[#2d3748]">Fee Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Management Fee</span>
                <Badge className="bg-[#2d3748] text-white">{escrowAccount.managementFeeRate}%</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">Covers property management, maintenance, and operations</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Platform Fee</span>
                <Badge className="bg-[#d69e2e] text-white">{escrowAccount.platformFeeRate}%</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">Platform maintenance and technology infrastructure</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
