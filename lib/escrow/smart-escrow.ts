import { hederaConsensusService } from "../hedera/hcs"
import type { DividendDistribution } from "../types/hedera"

export interface EscrowAccount {
  id: string
  propertyId: string
  balance: number
  currency: "USDC" | "HBAR"
  lastDistribution: Date
  totalDistributed: number
  managementFeeRate: number // Percentage
  platformFeeRate: number // Percentage
}

export interface EscrowTransaction {
  id: string
  escrowId: string
  type: "deposit" | "withdrawal" | "fee_distribution" | "dividend_distribution"
  amount: number
  currency: "USDC" | "HBAR"
  recipient?: string
  description: string
  timestamp: Date
  transactionHash?: string
}

export class SmartEscrowService {
  // Create escrow account for a property
  async createEscrowAccount(
    propertyId: string,
    managementFeeRate = 2.0,
    platformFeeRate = 0.5,
  ): Promise<EscrowAccount> {
    try {
      const escrowAccount: EscrowAccount = {
        id: `escrow_${propertyId}_${Date.now()}`,
        propertyId,
        balance: 0,
        currency: "USDC",
        lastDistribution: new Date(),
        totalDistributed: 0,
        managementFeeRate,
        platformFeeRate,
      }

      return escrowAccount
    } catch (error) {
      console.error("Error creating escrow account:", error)
      throw new Error("Failed to create escrow account")
    }
  }

  // Deposit rental income into escrow
  async depositRentalIncome(escrowAccount: EscrowAccount, amount: number, topicId: string): Promise<EscrowTransaction> {
    try {
      const transaction: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        escrowId: escrowAccount.id,
        type: "deposit",
        amount,
        currency: "USDC",
        description: `Rental income deposit for property ${escrowAccount.propertyId}`,
        timestamp: new Date(),
      }

      // Update escrow balance
      escrowAccount.balance += amount

      // Log to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId: escrowAccount.propertyId,
        action: "RENTAL_INCOME_DEPOSITED",
        details: {
          escrowId: escrowAccount.id,
          amount,
          newBalance: escrowAccount.balance,
          transactionId: transaction.id,
        },
        timestamp: Date.now(),
      })

      return transaction
    } catch (error) {
      console.error("Error depositing rental income:", error)
      throw new Error("Failed to deposit rental income")
    }
  }

  // Calculate and distribute fees automatically
  async distributeFees(
    escrowAccount: EscrowAccount,
    topicId: string,
    managementCompanyAccount: string,
    platformAccount: string,
  ): Promise<EscrowTransaction[]> {
    try {
      const transactions: EscrowTransaction[] = []
      const availableBalance = escrowAccount.balance

      // Calculate fees
      const managementFee = (availableBalance * escrowAccount.managementFeeRate) / 100
      const platformFee = (availableBalance * escrowAccount.platformFeeRate) / 100

      // Management fee distribution
      if (managementFee > 0) {
        const mgmtTransaction: EscrowTransaction = {
          id: `tx_mgmt_${Date.now()}`,
          escrowId: escrowAccount.id,
          type: "fee_distribution",
          amount: managementFee,
          currency: "USDC",
          recipient: managementCompanyAccount,
          description: `Management fee (${escrowAccount.managementFeeRate}%)`,
          timestamp: new Date(),
        }
        transactions.push(mgmtTransaction)
        escrowAccount.balance -= managementFee
      }

      // Platform fee distribution
      if (platformFee > 0) {
        const platformTransaction: EscrowTransaction = {
          id: `tx_platform_${Date.now()}`,
          escrowId: escrowAccount.id,
          type: "fee_distribution",
          amount: platformFee,
          currency: "USDC",
          recipient: platformAccount,
          description: `Platform fee (${escrowAccount.platformFeeRate}%)`,
          timestamp: new Date(),
        }
        transactions.push(platformTransaction)
        escrowAccount.balance -= platformFee
      }

      // Log fee distributions to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId: escrowAccount.propertyId,
        action: "FEES_DISTRIBUTED",
        details: {
          escrowId: escrowAccount.id,
          managementFee,
          platformFee,
          remainingBalance: escrowAccount.balance,
          transactions: transactions.map((tx) => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            recipient: tx.recipient,
          })),
        },
        timestamp: Date.now(),
      })

      return transactions
    } catch (error) {
      console.error("Error distributing fees:", error)
      throw new Error("Failed to distribute fees")
    }
  }

  // Distribute dividends to token holders
  async distributeDividends(
    escrowAccount: EscrowAccount,
    tokenHolders: { accountId: string; tokenAmount: number }[],
    totalTokenSupply: number,
    topicId: string,
  ): Promise<DividendDistribution> {
    try {
      const availableForDividends = escrowAccount.balance
      const distributionDate = new Date()

      const recipients = tokenHolders.map((holder) => {
        const ownershipPercentage = holder.tokenAmount / totalTokenSupply
        const dividendAmount = availableForDividends * ownershipPercentage

        return {
          accountId: holder.accountId,
          tokenAmount: holder.tokenAmount,
          dividendAmount,
        }
      })

      const distribution: DividendDistribution = {
        id: `div_${escrowAccount.propertyId}_${Date.now()}`,
        propertyId: escrowAccount.propertyId,
        totalAmount: availableForDividends,
        distributionDate,
        recipients,
        status: "pending",
      }

      // Update escrow account
      escrowAccount.balance = 0 // All available balance distributed
      escrowAccount.lastDistribution = distributionDate
      escrowAccount.totalDistributed += availableForDividends

      // Log dividend distribution to HCS
      await hederaConsensusService.logDividendDistribution(topicId, escrowAccount.propertyId, {
        distributionId: distribution.id,
        totalAmount: availableForDividends,
        recipientCount: recipients.length,
        distributionDate: distributionDate.toISOString(),
      })

      return distribution
    } catch (error) {
      console.error("Error distributing dividends:", error)
      throw new Error("Failed to distribute dividends")
    }
  }

  // Get escrow account history
  async getEscrowHistory(escrowId: string): Promise<EscrowTransaction[]> {
    // In a real implementation, this would fetch from a database
    // For now, return mock data
    return [
      {
        id: "tx_1",
        escrowId,
        type: "deposit",
        amount: 5000,
        currency: "USDC",
        description: "Monthly rental income",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "tx_2",
        escrowId,
        type: "fee_distribution",
        amount: 100,
        currency: "USDC",
        recipient: "0.0.management",
        description: "Management fee (2%)",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: "tx_3",
        escrowId,
        type: "dividend_distribution",
        amount: 4900,
        currency: "USDC",
        description: "Monthly dividend distribution",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ]
  }

  // Calculate next distribution date
  calculateNextDistribution(lastDistribution: Date, frequency: "monthly" | "quarterly" = "monthly"): Date {
    const nextDate = new Date(lastDistribution)

    if (frequency === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1)
    } else {
      nextDate.setMonth(nextDate.getMonth() + 3)
    }

    return nextDate
  }
}

export const smartEscrowService = new SmartEscrowService()
