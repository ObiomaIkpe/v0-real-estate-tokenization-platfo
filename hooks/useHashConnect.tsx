"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { HashConnect, LedgerId, PairingData } from "hashconnect";

type HashConnectContextType = {
  accountId: string | null;
  pairingData: PairingData | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  ready: boolean;
};

const HashConnectContext = createContext<HashConnectContextType | undefined>(
  undefined
);

const appMetadata = {
  name: "REALiFi",
  description: "Real Estate Tokenization Platform",
  icons: ["https://v0-real-estate-tokenization-platfo.vercel.app/favicon.ico"],
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://your-dapp.example",
};

export const HashConnectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [pairingData, setPairingData] = useState<PairingData | null>(null);
  const [ready, setReady] = useState(false);
  const hcRef = useRef<HashConnect | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const projectId =
          process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
        if (!projectId) {
          console.warn("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set.");
        }

        // Correct constructor
        const hc = new HashConnect(
          LedgerId.TESTNET,
          projectId,
          appMetadata,
          true
        );

        hc.pairingEvent.on((pd: PairingData) => {
          if (!mounted) return;
          setPairingData(pd);
          if (pd.accountIds?.length) {
            setAccountId(pd.accountIds[0]);
          }
        });

        hc.disconnectionEvent.on(() => {
          if (!mounted) return;
          setAccountId(null);
          setPairingData(null);
        });

        await hc.init();

        // ✅ FIX: pairings now live on hc.pairing
        const saved = hc.pairing?.pairings ?? [];
        if (saved.length > 0) {
          const first = saved[0];
          setPairingData(first);
          if (first.accountIds?.length) {
            setAccountId(first.accountIds[0]);
          }
        }

        hcRef.current = hc;
        if (mounted) setReady(true);
      } catch (err) {
        console.error("HashConnect init error:", err);
      }
    };

    init();

    return () => {
      mounted = false;
      hcRef.current?.pairingEvent?.removeAllListeners?.();
      hcRef.current?.disconnectionEvent?.removeAllListeners?.();
    };
  }, []);

  const connect = useCallback(async () => {
    const hc = hcRef.current;
    if (!hc) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    hc.openPairingModal();
  }, []);

  const disconnect = useCallback(() => {
    const hc = hcRef.current;
    if (!hc) return;

    const saved = hc.pairing?.pairings ?? [];
    for (const p of saved) {
      if (p.topic) {
        hc.disconnect(p.topic).catch((e) =>
          console.warn("disconnect error", e)
        );
      }
    }
    setAccountId(null);
    setPairingData(null);
  }, []);

  const value: HashConnectContextType = {
    accountId,
    pairingData,
    connect,
    disconnect,
    ready,
  };

  return (
    <HashConnectContext.Provider value={value}>
      {children}
    </HashConnectContext.Provider>
  );
};

export const useHashConnect = (): HashConnectContextType => {
  const ctx = useContext(HashConnectContext);
  if (!ctx) {
    throw new Error("useHashConnect must be used inside HashConnectProvider");
  }
  return ctx;
};
