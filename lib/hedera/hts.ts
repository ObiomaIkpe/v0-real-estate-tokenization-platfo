import {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenAssociateTransaction,
  TransferTransaction,
  TokenId,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk"
import { hederaClient } from "./client"

export interface PropertyToken {
  tokenId: string
  name: string
  symbol: string
  totalSupply: number
  decimals: number
  propertyId: string
}

export class HederaTokenService {
  private client = hederaClient.getClient()
  private operatorId = hederaClient.getOperatorId()
  private operatorKey = hederaClient.getOperatorKey()

  // Create a new property token using HTS
  async createPropertyToken(
    propertyName: string,
    propertySymbol: string,
    totalSupply: number,
    propertyId: string,
  ): Promise<PropertyToken> {
    try {
      const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName(`REALiFi ${propertyName}`)
        .setTokenSymbol(propertySymbol)
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(2) // Allow fractional ownership to 2 decimal places
        .setInitialSupply(totalSupply * 100) // Multiply by 100 for 2 decimals
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(totalSupply * 100)
        .setTreasuryAccountId(this.operatorId)
        .setAdminKey(this.operatorKey)
        .setSupplyKey(this.operatorKey)
        .setFreezeDefault(false)
        .freezeWith(this.client)

      const tokenCreateSign = await tokenCreateTx.sign(this.operatorKey)
      const tokenCreateSubmit = await tokenCreateSign.execute(this.client)
      const tokenCreateRx = await tokenCreateSubmit.getReceipt(this.client)

      const tokenId = tokenCreateRx.tokenId!.toString()

      return {
        tokenId,
        name: `REALiFi ${propertyName}`,
        symbol: propertySymbol,
        totalSupply,
        decimals: 2,
        propertyId,
      }
    } catch (error) {
      console.error("Error creating property token:", error)
      throw new Error("Failed to create property token")
    }
  }

  // Transfer property tokens to investor
  async transferTokens(tokenId: string, toAccountId: string, amount: number): Promise<string> {
    try {
      const transferTx = new TransferTransaction()
        .addTokenTransfer(TokenId.fromString(tokenId), this.operatorId, -amount * 100)
        .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(toAccountId), amount * 100)
        .freezeWith(this.client)

      const transferSign = await transferTx.sign(this.operatorKey)
      const transferSubmit = await transferSign.execute(this.client)
      const transferRx = await transferSubmit.getReceipt(this.client)

      return transferSubmit.transactionId.toString()
    } catch (error) {
      console.error("Error transferring tokens:", error)
      throw new Error("Failed to transfer tokens")
    }
  }

  // Associate token with investor account
  async associateToken(tokenId: string, accountId: string, accountKey: string): Promise<string> {
    try {
      const associateTx = new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([TokenId.fromString(tokenId)])
        .freezeWith(this.client)

      const associateSign = await associateTx.sign(PrivateKey.fromString(accountKey))
      const associateSubmit = await associateSign.execute(this.client)
      const associateRx = await associateSubmit.getReceipt(this.client)

      return associateSubmit.transactionId.toString()
    } catch (error) {
      console.error("Error associating token:", error)
      throw new Error("Failed to associate token")
    }
  }
}

export const hederaTokenService = new HederaTokenService()
