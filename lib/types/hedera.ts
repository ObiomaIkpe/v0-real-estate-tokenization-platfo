export interface HederaProperty {
  id: string
  name: string
  location: string
  price: number
  tokenId?: string
  topicId?: string
  totalTokens: number
  availableTokens: number
  pricePerToken: number
  verified: boolean
  images: string[]
  description: string
  expectedReturn: number
  propertyType: string
  createdAt: Date
  updatedAt: Date
}

export interface TokenPurchase {
  id: string
  propertyId: string
  investorAccountId: string
  tokenAmount: number
  usdcAmount: number
  transactionId: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
}

export interface DividendDistribution {
  id: string
  propertyId: string
  totalAmount: number
  distributionDate: Date
  recipients: {
    accountId: string
    tokenAmount: number
    dividendAmount: number
  }[]
  transactionId?: string
  status: "pending" | "completed" | "failed"
}

export interface GovernanceProposal {
  id: string
  propertyId: string
  title: string
  description: string
  proposer: string
  votingPower: number
  votes: {
    for: number
    against: number
    abstain: number
  }
  status: "active" | "passed" | "rejected" | "executed"
  createdAt: Date
  endDate: Date
}
