export type EscrowAccount = {
  id: string;
  propertyId: string;
  balance: number;
  currency: string;
  lastDistribution: Date;
  totalDistributed: number;
  managementFeeRate: number;
  platformFeeRate: number;
};

export type EscrowTransaction = {
  id: string;
  escrowId: string;
  type: "deposit" | "fee_distribution" | "dividend_distribution";
  amount: number;
  currency: string;
  recipient?: string;
  description: string;
  timestamp: Date;
};

class SmartEscrowService {
  async distributeFees(
    escrow: EscrowAccount,
    topicId: string,
    managementId: string,
    platformId: string
  ) {
    const res = await fetch("/api/escrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        escrowId: escrow.id,
        amount:
          (escrow.balance *
            (escrow.managementFeeRate + escrow.platformFeeRate)) /
          100,
        topicId,
        managementId,
        platformId,
      }),
    });

    if (!res.ok) throw new Error("Failed to distribute fees");

    const data = await res.json();

    // Return a fake transaction object for UI (real one would come from server)
    return [
      {
        id: data.txId,
        escrowId: escrow.id,
        type: "fee_distribution",
        amount: escrow.balance * 0.025,
        currency: escrow.currency,
        description: "Distributed management + platform fees",
        timestamp: new Date(),
      },
    ] as EscrowTransaction[];
  }

  async distributeDividends(
    escrow: EscrowAccount,
    tokenHolders: { accountId: string; tokenAmount: number }[],
    totalDividend: number,
    topicId: string
  ) {
    const res = await fetch("/api/escrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        escrowId: escrow.id,
        amount: totalDividend,
        tokenHolders,
        topicId,
      }),
    });

    if (!res.ok) throw new Error("Failed to distribute dividends");

    const data = await res.json();

    return data;
  }
}

export const smartEscrowService = new SmartEscrowService();
