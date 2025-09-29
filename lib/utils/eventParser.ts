import { RealEstateDAppABI } from "@/constants/RealEstateDApp";
import { TransactionReceipt, decodeEventLog } from "viem";

// --- START: NEW TYPE DEFINITIONS ---
interface AssetCreatedArgs {
  tokenId: bigint;
  [key: string]: any; // Allows for other properties that might be on the args object
}

interface FractionalAssetCreatedArgs {
  tokenId: bigint;
  totalTokens: bigint;
  pricePerToken: bigint;
  [key: string]: any; // Allows for other properties
}
// --- END: NEW TYPE DEFINITIONS ---

/**
 * Extract tokenId from AssetCreated event in transaction receipt
 */
export function extractTokenIdFromReceipt(
  receipt: TransactionReceipt
): bigint | null {
  try {
    // Find the AssetCreated event
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: RealEstateDAppABI,
          data: log.data,
          topics: log.topics,
        });

        // Check if it's the AssetCreated event
        if (decoded.eventName === "AssetCreated") {
          // 🛑 FIX 1: Check if args exists (Addresses 'possibly undefined' error)
          if (!decoded.args) {
            console.warn(
              "AssetCreated event found but args were undefined. Skipping log."
            );
            continue;
          }

          // 🛑 FIX 2: Assert the type (Addresses 'Property does not exist' error)
          const args = decoded.args as unknown as AssetCreatedArgs;

          return args.tokenId;
        }
      } catch (e) {
        // Skip logs that don't match our ABI
        continue;
      }
    }

    return null;
  } catch (error) {
    // 💡 IMPROVEMENT: Better error logging
    console.error("Error extracting tokenId from receipt:", error);
    return null;
  }
}

/**
 * Extract token information from FractionalAssetCreated event
 */
export function extractFractionalInfoFromReceipt(receipt: TransactionReceipt): {
  tokenId: bigint;
  totalTokens: bigint;
  pricePerToken: bigint;
} | null {
  try {
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: RealEstateDAppABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === "FractionalAssetCreated") {
          // 🛑 FIX 1: Check if args exists (Addresses 'possibly undefined' error)
          if (!decoded.args) {
            console.warn(
              "FractionalAssetCreated event found but args were undefined. Skipping log."
            );
            continue;
          }

          // 🛑 FIX 2: Assert the type (Addresses 'Property does not exist' error)
          const args = decoded.args as unknown as AssetCreatedArgs;

          return {
            tokenId: args.tokenId,
            totalTokens: args.totalTokens,
            pricePerToken: args.pricePerToken,
          };
        }
      } catch (e) {
        continue;
      }
    }

    return null;
  } catch (error) {
    // 💡 IMPROVEMENT: Better error logging
    console.error("Error extracting fractional info from receipt:", error);
    return null;
  }
}

// -------------------------------------------------------------------
// Helper Functions (No critical errors, but improved slightly for clarity)
// -------------------------------------------------------------------

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string): string {
  // Defensive check for input hash length
  if (typeof hash !== "string" || hash.length < 18) {
    return hash;
  }
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

/**
 * Get block explorer URL based on chain
 */
export function getBlockExplorerUrl(
  txHash: string,
  chainId: number = 8453
): string {
  const explorers: Record<number, string> = {
    1: "https://etherscan.io/tx",
    8453: "https://basescan.org/tx", // Base Mainnet
    84532: "https://sepolia.basescan.org/tx", // Base Sepolia
  };

  // Use the specific explorer URL or default to the most common one (Base Mainnet)
  const baseUrl = explorers[chainId] || explorers[8453];
  return `${baseUrl}/${txHash}`;
}
