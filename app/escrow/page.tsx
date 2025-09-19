"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { EscrowDashboard } from "@/components/escrow/escrow-dashboard"
import { type EscrowAccount, type EscrowTransaction, smartEscrowService } from "@/lib/escrow/smart-escrow"

export default function EscrowPage() {
  const [escrowAccount, setEscrowAccount] = useState<EscrowAccount | null>(null)
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock escrow account data
    const mockEscrowAccount: EscrowAccount = {
      id: "escrow_miami_001",
      propertyId: "prop_miami_001",
      balance: 12500,
      currency: "USDC",
      lastDistribution: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      totalDistributed: 45000,
      managementFeeRate: 2.0,
      platformFeeRate: 0.5,
    }

    const mockTransactions: EscrowTransaction[] = [
      {
        id: "tx_1",
        escrowId: "escrow_miami_001",
        type: "deposit",
        amount: 5000,
        currency: "USDC",
        description: "Monthly rental income - December 2024",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "tx_2",
        escrowId: "escrow_miami_001",
        type: "deposit",
        amount: 7500,
        currency: "USDC",
        description: "Monthly rental income - January 2025",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "tx_3",
        escrowId: "escrow_miami_001",
        type: "fee_distribution",
        amount: 100,
        currency: "USDC",
        recipient: "0.0.management",
        description: "Management fee (2%)",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "tx_4",
        escrowId: "escrow_miami_001",
        type: "dividend_distribution",
        amount: 4900,
        currency: "USDC",
        description: "Monthly dividend distribution",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ]

    setEscrowAccount(mockEscrowAccount)
    setTransactions(mockTransactions)
    setLoading(false)
  }, [])

  const handleDistributeFees = async () => {
    if (!escrowAccount) return

    try {
      // In a real implementation, this would call the smart escrow service
      const feeTransactions = await smartEscrowService.distributeFees(
        escrowAccount,
        "topic_miami_001",
        "0.0.management",
        "0.0.platform",
      )

      // Update local state
      setTransactions((prev) => [...feeTransactions, ...prev])
      setEscrowAccount((prev) => (prev ? { ...prev, balance: prev.balance * 0.975 } : null))
    } catch (error) {
      console.error("Error distributing fees:", error)
    }
  }

  const handleDistributeDividends = async () => {
    if (!escrowAccount) return

    try {
      // Mock token holders
      const tokenHolders = [
        { accountId: "0.0.investor1", tokenAmount: 150 },
        { accountId: "0.0.investor2", tokenAmount: 300 },
        { accountId: "0.0.investor3", tokenAmount: 550 },
      ]

      const distribution = await smartEscrowService.distributeDividends(
        escrowAccount,
        tokenHolders,
        1000,
        "topic_miami_001",
      )

      // Create transaction record
      const dividendTransaction: EscrowTransaction = {
        id: `tx_div_${Date.now()}`,
        escrowId: escrowAccount.id,
        type: "dividend_distribution",
        amount: escrowAccount.balance,
        currency: "USDC",
        description: `Dividend distribution to ${tokenHolders.length} investors`,
        timestamp: new Date(),
      }

      // Update local state
      setTransactions((prev) => [dividendTransaction, ...prev])
      setEscrowAccount((prev) =>
        prev
          ? {
              ...prev,
              balance: 0,
              lastDistribution: new Date(),
              totalDistributed: prev.totalDistributed + prev.balance,
            }
          : null,
      )
    } catch (error) {
      console.error("Error distributing dividends:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d69e2e] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading escrow dashboard...</p>
        </div>
      </div>
    )
  }

  if (!escrowAccount) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No escrow account found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2d3748] text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Image src="/favicon.ico" alt="REALiFi Logo" width={32} height={32} className="rounded" />
          <div>
            <h1 className="text-2xl font-bold">Smart Escrow Dashboard</h1>
            <p className="text-gray-300">Property: {escrowAccount.propertyId}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <EscrowDashboard
          escrowAccount={escrowAccount}
          transactions={transactions}
          onDistributeDividends={handleDistributeDividends}
          onDistributeFees={handleDistributeFees}
        />
      </div>
    </div>
  )
}
