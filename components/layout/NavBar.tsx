"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { HashConnect } from "hashconnect";

const appMetadata = {
  name: "REALiFi",
  description: "Real Estate Tokenization Platform",
  icon: "https://your-app.com/logo.png", // update with your logo
};

export default function NavBar() {
  const [hashConnect, setHashConnect] = useState<HashConnect | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Init HashConnect
  useEffect(() => {
    const init = async () => {
      const hc = new HashConnect();
      await hc.init(appMetadata, "testnet", false);

      hc.pairingEvent.on((pairingData) => {
        const accountId = pairingData.accountIds[0];
        setConnectedAccount(accountId);
      });

      setHashConnect(hc);
    };
    init();
  }, []);

  const connectWallet = useCallback(async () => {
    if (!hashConnect) return;
    await hashConnect.connectToBrowserWallet();
  }, [hashConnect]);

  const disconnectWallet = useCallback(() => {
    setConnectedAccount(null);
    hashConnect?.disconnect();
  }, [hashConnect]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              REALiFi
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="hover:text-blue-600">
              Explore
            </Link>
            <Link href="/escrow" className="hover:text-blue-600">
              Escrow
            </Link>
            {connectedAccount && (
              <Link
                href="/portfolio"
                className="hover:text-blue-600 font-semibold"
              >
                My Portfolio
              </Link>
            )}

            {/* Wallet + Submit Property */}
            {connectedAccount ? (
              <>
                <button
                  onClick={disconnectWallet}
                  className="px-3 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300"
                >
                  Disconnect
                </button>
                <Link
                  href="/submit-property"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Submit Property
                </Link>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link href="/explore" className="block hover:text-blue-600">
            Explore
          </Link>
          <Link href="/escrow" className="block hover:text-blue-600">
            Escrow
          </Link>
          {connectedAccount && (
            <Link href="/portfolio" className="block hover:text-blue-600">
              My Portfolio
            </Link>
          )}

          {connectedAccount ? (
            <>
              <button
                onClick={disconnectWallet}
                className="w-full px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Disconnect
              </button>
              <Link
                href="/submit-property"
                className="block w-full text-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit Property
              </Link>
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
