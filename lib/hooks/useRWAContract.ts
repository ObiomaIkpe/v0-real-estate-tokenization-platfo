import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits } from "viem";
import {
  RealEstateDAppABI,
  RealEstateDAppAddress,
} from "@/constants/RealEstateDApp";

export interface CreateAssetParams {
  name: string;
  tokenURI: string;
  imageURL: string;
  price: bigint; // Price in USDC (e.g., "100000" for $100,000)
  description: string;
}

export interface CreateFractionalAssetParams {
  tokenId: bigint;
  totalTokens: bigint;
}

export function useRWAContract() {
  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const createAsset = async (params: CreateAssetParams) => {
    try {
      // Convert price to Wei (USDC has 6 decimals)
      const priceInWei = params.price;

      const hash = await writeContractAsync({
        address: RealEstateDAppAddress as `0x${string}`,
        abi: RealEstateDAppABI,
        functionName: "createAsset",
        args: [
          params.name,
          params.tokenURI,
          params.imageURL,
          priceInWei,
          params.description,
        ],
      });

      return hash;
    } catch (err) {
      console.error("Error creating asset:", err);
      throw err;
    }
  };

  const createFractionalAsset = async (params: CreateFractionalAssetParams) => {
    try {
      const hash = await writeContractAsync({
        address: RealEstateDAppAddress as `0x${string}`,
        abi: RealEstateDAppABI,
        functionName: "createFractionalAsset",
        args: [params.tokenId, params.totalTokens],
      });

      return hash;
    } catch (err) {
      console.error("Error creating fractional asset:", err);
      throw err;
    }
  };

  return {
    createAsset,
    createFractionalAsset,
    isPending,
    error,
    hash,
  };
}

// Hook to wait for transaction confirmation
export function useTransactionConfirmation(hash: `0x${string}` | undefined) {
  const { isLoading, isSuccess, isError, data } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    isConfirming: isLoading,
    isConfirmed: isSuccess,
    isError,
    receipt: data,
  };
}

// Hook to get the latest tokenId (useful after creating an asset)
export function useLatestTokenId() {
  const { data: allAssets } = useReadContract({
    address: RealEstateDAppAddress as `0x${string}`,
    abi: RealEstateDAppABI,
    functionName: "fetchAllListedAssets",
  });

  // Get the highest tokenId from the array
  const latestTokenId =
    allAssets && Array.isArray(allAssets) && allAssets.length > 0
      ? allAssets[allAssets.length - 1]?.tokenId
      : null;

  return latestTokenId;
}
