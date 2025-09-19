import { Client, PrivateKey, AccountId } from "@hashgraph/sdk"

// Hedera client configuration
export class HederaClient {
  private client: Client
  private operatorId: AccountId
  private operatorKey: PrivateKey

  constructor() {
    // Initialize with testnet for hackathon demo
    this.client = Client.forTestnet()

    // Use environment variables for operator account
    this.operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID || "0.0.123456")
    this.operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY || "")

    this.client.setOperator(this.operatorId, this.operatorKey)
  }

  getClient(): Client {
    return this.client
  }

  getOperatorId(): AccountId {
    return this.operatorId
  }

  getOperatorKey(): PrivateKey {
    return this.operatorKey
  }
}

// Singleton instance
export const hederaClient = new HederaClient()
