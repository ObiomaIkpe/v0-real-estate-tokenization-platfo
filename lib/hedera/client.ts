import { Client, PrivateKey, AccountId } from "@hashgraph/sdk";

class HederaClient {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;

  constructor() {
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = process.env.HEDERA_OPERATOR_KEY;

    if (!operatorId || !operatorKey) {
      throw new Error(
        "Missing Hedera operator credentials in environment variables"
      );
    }

    this.client = Client.forTestnet();
    this.operatorId = AccountId.fromString(operatorId);
    this.operatorKey = PrivateKey.fromString(operatorKey);
    this.client.setOperator(this.operatorId, this.operatorKey);
  }

  getClient() {
    return this.client;
  }
}

export const hederaClient = new HederaClient();
