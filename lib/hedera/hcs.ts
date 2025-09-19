import { TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk"
import { hederaClient } from "./client"

export interface PropertyAuditLog {
  propertyId: string
  action: string
  details: any
  timestamp: number
  transactionId?: string
}

export class HederaConsensusService {
  private client = hederaClient.getClient()
  private operatorKey = hederaClient.getOperatorKey()

  // Create a topic for property audit logs
  async createPropertyTopic(propertyId: string): Promise<string> {
    try {
      const topicCreateTx = new TopicCreateTransaction()
        .setTopicMemo(`REALiFi Property Audit Log - ${propertyId}`)
        .setAdminKey(this.operatorKey)
        .setSubmitKey(this.operatorKey)
        .freezeWith(this.client)

      const topicCreateSign = await topicCreateTx.sign(this.operatorKey)
      const topicCreateSubmit = await topicCreateSign.execute(this.client)
      const topicCreateRx = await topicCreateSubmit.getReceipt(this.client)

      return topicCreateRx.topicId!.toString()
    } catch (error) {
      console.error("Error creating property topic:", error)
      throw new Error("Failed to create property topic")
    }
  }

  // Submit audit log message to HCS
  async submitAuditLog(topicId: string, auditLog: PropertyAuditLog): Promise<string> {
    try {
      const message = JSON.stringify({
        ...auditLog,
        timestamp: Date.now(),
      })

      const topicMessageTx = new TopicMessageSubmitTransaction()
        .setTopicId(TopicId.fromString(topicId))
        .setMessage(message)
        .freezeWith(this.client)

      const topicMessageSign = await topicMessageTx.sign(this.operatorKey)
      const topicMessageSubmit = await topicMessageSign.execute(this.client)
      const topicMessageRx = await topicMessageSubmit.getReceipt(this.client)

      return topicMessageSubmit.transactionId.toString()
    } catch (error) {
      console.error("Error submitting audit log:", error)
      throw new Error("Failed to submit audit log")
    }
  }

  // Log property verification
  async logPropertyVerification(topicId: string, propertyId: string, verificationDetails: any): Promise<string> {
    const auditLog: PropertyAuditLog = {
      propertyId,
      action: "PROPERTY_VERIFIED",
      details: verificationDetails,
      timestamp: Date.now(),
    }

    return this.submitAuditLog(topicId, auditLog)
  }

  // Log token purchase
  async logTokenPurchase(topicId: string, propertyId: string, purchaseDetails: any): Promise<string> {
    const auditLog: PropertyAuditLog = {
      propertyId,
      action: "TOKEN_PURCHASE",
      details: purchaseDetails,
      timestamp: Date.now(),
    }

    return this.submitAuditLog(topicId, auditLog)
  }

  // Log dividend distribution
  async logDividendDistribution(topicId: string, propertyId: string, dividendDetails: any): Promise<string> {
    const auditLog: PropertyAuditLog = {
      propertyId,
      action: "DIVIDEND_DISTRIBUTED",
      details: dividendDetails,
      timestamp: Date.now(),
    }

    return this.submitAuditLog(topicId, auditLog)
  }
}

export const hederaConsensusService = new HederaConsensusService()
