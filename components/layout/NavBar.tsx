// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useAccount, useDisconnect, useBalance } from "wagmi";

// const appMetadata = {
//   name: "REALiFi",
//   description: "Real Estate Tokenization Platform",
//   icon: "https://your-app.com/logo.png", // update with your logo
// };

// export default function NavBar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [accountMenuOpen, setAccountMenuOpen] = useState(false);
//   const { address, isConnected } = useAccount();
//   const { disconnect } = useDisconnect();
//   const { data: balance } = useBalance({
//     address: address,
//   });

//   // Initialize app metadata
//   useEffect(() => {
//     if (typeof document !== "undefined") {
//       document.title = appMetadata.name;

//       let metaDescription = document.querySelector('meta[name="description"]');
//       if (metaDescription) {
//         metaDescription.setAttribute("content", appMetadata.description);
//       } else {
//         metaDescription = document.createElement("meta");
//         metaDescription.setAttribute("name", "description");
//         metaDescription.setAttribute("content", appMetadata.description);
//         document.getElementsByTagName("head")[0].appendChild(metaDescription);
//       }

//       let link = document.querySelector('link[rel="icon"]');
//       if (link) {
//         link.setAttribute("href", appMetadata.icon);
//       } else {
//         link = document.createElement("link");
//         link.setAttribute("rel", "icon");
//         link.setAttribute("href", appMetadata.icon);
//         document.getElementsByTagName("head")[0].appendChild(link);
//       }
//     }
//   }, []);

//   const disconnectWallet = () => {
//     disconnect();
//     setAccountMenuOpen(false);
//   };

//   const formatAddress = (addr: string) => {
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   const formatBalance = (balance: any) => {
//     if (!balance) return "0.00";
//     const value = parseFloat(balance.formatted);
//     return value.toFixed(4);
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="text-xl font-bold text-blue-600">
//               REALiFi
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link
//               href="/demo"
//               className="hover:text-blue-600 transition-colors"
//             >
//               Demo
//             </Link>

//             <Link
//               href="/governance"
//               className="hover:text-blue-600 transition-colors"
//             >
//               Governance
//             </Link>
//             <Link
//               href="/insurance"
//               className="hover:text-blue-600 transition-colors"
//             >
//               Insurance
//             </Link>
//             <Link
//               href="/admin"
//               className="hover:text-blue-600 transition-colors"
//             >
//               Admin
//             </Link>
//             <Link
//               href="/compliance"
//               className="hover:text-blue-600 transition-colors"
//             >
//               Compliance
//             </Link>
//             {isConnected && (
//               <Link
//                 href="/portfolio"
//                 className="hover:text-blue-600 font-semibold transition-colors"
//               >
//                 My Portfolio
//               </Link>
//             )}

//             {/* Wallet Connection */}
//             {isConnected ? (
//               <div className="flex items-center space-x-4">
//                 {/* Submit Property Button - Fixed URL */}
//                 <Link
//                   href="/submit"
//                   className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Submit Property
//                 </Link>

//                 {/* Account Info */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setAccountMenuOpen(!accountMenuOpen)}
//                     className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white"
//                   >
//                     {/* Avatar */}
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
//                       {address ? address.slice(2, 4).toUpperCase() : "??"}
//                     </div>

//                     {/* Address and Balance */}
//                     <div className="text-left">
//                       <div className="text-sm font-medium text-gray-900">
//                         {address ? formatAddress(address) : ""}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {formatBalance(balance)} HBAR
//                       </div>
//                     </div>

//                     {/* Dropdown arrow */}
//                     <svg
//                       className={`w-4 h-4 text-gray-400 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>

//                   {/* Dropdown Menu */}
//                   {accountMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
//                       <div className="px-4 py-2 border-b border-gray-100">
//                         <div className="text-sm font-medium text-gray-900">
//                           {address ? formatAddress(address) : ""}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Balance: {formatBalance(balance)} HBAR
//                         </div>
//                       </div>

//                       <Link
//                         href="/portfolio"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                         onClick={() => setAccountMenuOpen(false)}
//                       >
//                         My Portfolio
//                       </Link>

//                       <button
//                         onClick={() =>
//                           navigator.clipboard.writeText(address || "")
//                         }
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         Copy Address
//                       </button>

//                       <hr className="my-2" />

//                       <button
//                         onClick={disconnectWallet}
//                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                       >
//                         Disconnect Wallet
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <ConnectButton.Custom>
//                 {({
//                   account,
//                   chain,
//                   openAccountModal,
//                   openChainModal,
//                   openConnectModal,
//                   authenticationStatus,
//                   mounted,
//                 }) => {
//                   const ready = mounted && authenticationStatus !== "loading";
//                   const connected =
//                     ready &&
//                     account &&
//                     chain &&
//                     (!authenticationStatus ||
//                       authenticationStatus === "authenticated");

//                   return (
//                     <div
//                       {...(!ready && {
//                         "aria-hidden": true,
//                         style: {
//                           opacity: 0,
//                           pointerEvents: "none",
//                           userSelect: "none",
//                         },
//                       })}
//                     >
//                       {(() => {
//                         if (!connected) {
//                           return (
//                             <button
//                               onClick={openConnectModal}
//                               type="button"
//                               className="px-6 py-2 rounded-lg bg-white border border-gray-300 text-black hover:bg-gray-50 transition-colors font-medium"
//                             >
//                               Connect Wallet
//                             </button>
//                           );
//                         }
//                         return null;
//                       })()}
//                     </div>
//                   );
//                 }}
//               </ConnectButton.Custom>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="flex md:hidden items-center">
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="text-gray-600 focus:outline-none hover:text-gray-800 transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden px-4 pb-4 space-y-3 border-t border-gray-100">
//           <Link
//             href="/demo"
//             className="block py-2 hover:text-blue-600 transition-colors"
//           >
//             Demo
//           </Link>
//           <Link
//             href="/escrow"
//             className="block py-2 hover:text-blue-600 transition-colors"
//           >
//             Escrow
//           </Link>
//           <Link
//             href="/governance"
//             className="block py-2 hover:text-blue-600 transition-colors"
//           >
//             Governance
//           </Link>
//           <Link
//             href="/insurance"
//             className="block py-2 hover:text-blue-600 transition-colors"
//           >
//             Insurance
//           </Link>
//           <Link
//             href="/compliance"
//             className="block py-2 hover:text-blue-600 transition-colors"
//           >
//             Compliance
//           </Link>
//           {isConnected && (
//             <Link
//               href="/portfolio"
//               className="block py-2 hover:text-blue-600 font-semibold transition-colors"
//             >
//               My Portfolio
//             </Link>
//           )}

//           {isConnected ? (
//             <div className="space-y-3 pt-3 border-t border-gray-100">
//               {/* Account Info Mobile */}
//               <div className="flex items-center space-x-3 py-2">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
//                   {address ? address.slice(2, 4).toUpperCase() : "??"}
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium text-gray-900">
//                     {address ? formatAddress(address) : ""}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {formatBalance(balance)} HBAR
//                   </div>
//                 </div>
//               </div>

//               <Link
//                 href="/submit"
//                 className="block w-full text-center px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Submit Property
//               </Link>

//               <button
//                 onClick={() => navigator.clipboard.writeText(address || "")}
//                 className="block w-full text-left px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Copy Address
//               </button>

//               <button
//                 onClick={() => {
//                   disconnectWallet();
//                   setMenuOpen(false);
//                 }}
//                 className="block w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
//               >
//                 Disconnect Wallet
//               </button>
//             </div>
//           ) : (
//             <div className="pt-3 border-t border-gray-100">
//               <ConnectButton.Custom>
//                 {({
//                   account,
//                   chain,
//                   openAccountModal,
//                   openChainModal,
//                   openConnectModal,
//                   authenticationStatus,
//                   mounted,
//                 }) => {
//                   const ready = mounted && authenticationStatus !== "loading";
//                   const connected =
//                     ready &&
//                     account &&
//                     chain &&
//                     (!authenticationStatus ||
//                       authenticationStatus === "authenticated");

//                   return (
//                     <div
//                       {...(!ready && {
//                         "aria-hidden": true,
//                         style: {
//                           opacity: 0,
//                           pointerEvents: "none",
//                           userSelect: "none",
//                         },
//                       })}
//                     >
//                       {(() => {
//                         if (!connected) {
//                           return (
//                             <button
//                               onClick={() => {
//                                 openConnectModal();
//                                 setMenuOpen(false);
//                               }}
//                               type="button"
//                               className="w-full px-6 py-3 rounded-lg bg-white border border-gray-300 text-black hover:bg-gray-50 transition-colors font-medium"
//                             >
//                               Connect Wallet
//                             </button>
//                           );
//                         }
//                         return null;
//                       })()}
//                     </div>
//                   );
//                 }}
//               </ConnectButton.Custom>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Click outside to close dropdown */}
//       {accountMenuOpen && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setAccountMenuOpen(false)}
//         />
//       )}
//     </nav>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useAccount, useDisconnect, useBalance } from "wagmi";
// import { web3AuthService } from "@/lib/services/web3-auth.service";

// const appMetadata = {
//   name: "REALiFi",
//   description: "Real Estate Tokenization Platform",
//   icon: "", // update with your logo
// };

// export default function NavBar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [accountMenuOpen, setAccountMenuOpen] = useState(false);
//   const { address, isConnected, connector } = useAccount();
//   const { disconnect } = useDisconnect();
//   const { data: balance } = useBalance({
//     address: address,
//   });

//   // State to track if the user has been authenticated with the backend
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Use a useEffect hook to trigger the backend authentication process
//   useEffect(() => {
//     // This effect runs whenever the wallet connection status changes.
//     const handleAuthentication = async () => {
//       // Check for an existing token first to avoid unnecessary login calls.
//       const storedToken = web3AuthService.getToken();
//       if (storedToken) {
//         setIsAuthenticated(true);
//         return;
//       }

//       // If the user is connected but not yet authenticated, perform the login.
//       if (isConnected && address && connector) {
//         try {
//           const provider = await connector.getProvider();
//           await web3AuthService.login(provider, address);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error("Authentication failed:", error);
//           // Handle authentication failure, e.g., show an error message.
//           setIsAuthenticated(false);
//         }
//       } else {
//         // If disconnected, ensure the isAuthenticated state is false.
//         setIsAuthenticated(false);
//       }
//     };
//     handleAuthentication();
//   }, [isConnected, address, connector]);

//   // Initialize app metadata (existing code)
//   useEffect(() => {
//     if (typeof document !== "undefined") {
//       document.title = appMetadata.name;

//       let metaDescription = document.querySelector('meta[name="description"]');
//       if (metaDescription) {
//         metaDescription.setAttribute("content", appMetadata.description);
//       } else {
//         metaDescription = document.createElement("meta");
//         metaDescription.setAttribute("name", "description");
//         metaDescription.setAttribute("content", appMetadata.description);
//         document.getElementsByTagName("head")[0].appendChild(metaDescription);
//       }

//       let link = document.querySelector('link[rel="icon"]');
//       if (link) {
//         link.setAttribute("href", appMetadata.icon);
//       } else {
//         link = document.createElement("link");
//         link.setAttribute("rel", "icon");
//         link.setAttribute("href", appMetadata.icon);
//         document.getElementsByTagName("head")[0].appendChild(link);
//       }
//     }
//   }, []);

//   // Updated disconnect function to also clear the token from local storage
//   const disconnectWallet = () => {
//     disconnect();
//     setAccountMenuOpen(false);
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("walletAddress");
//     setIsAuthenticated(false);
//   };

//   const formatAddress = (addr: string) => {
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   const formatBalance = (balance: any) => {
//     if (!balance) return "0.00";
//     const value = parseFloat(balance.formatted);
//     return value.toFixed(4);
//   };

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useBalance, useSignMessage } from "wagmi";

const appMetadata = {
  name: "REALiFi",
  description: "Real Estate Tokenization Platform",
  icon: "https://your-app.com/logo.png", // update with your logo
};

const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3000/auth";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { data: balance } = useBalance({
    address: address,
  });

  // State to track if the user has been authenticated with the backend
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle authentication with backend
  const authenticateWithBackend = async (walletAddress: string) => {
    try {
      // Step 1: Get message from backend
      const messageResponse = await fetch(
        `${AUTH_API_BASE_URL}/message/${walletAddress}`
      );
      if (!messageResponse.ok) {
        throw new Error("Failed to get message from server");
      }
      const { message } = await messageResponse.json();

      // Step 2: Sign message using Wagmi
      const signature = await signMessageAsync({ message });

      // Step 3: Send signature to backend for verification
      const loginResponse = await fetch(`${AUTH_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, signature }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token } = await loginResponse.json();

      // Step 4: Store token in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("walletAddress", walletAddress);

      return token;
    } catch (error) {
      console.error("Backend authentication failed:", error);
      throw error;
    }
  };

  // Use a useEffect hook to trigger the backend authentication process
  useEffect(() => {
    const handleAuthentication = async () => {
      // Check for an existing token first to avoid unnecessary login calls
      const storedToken = localStorage.getItem("authToken");
      const storedAddress = localStorage.getItem("walletAddress");

      if (storedToken && storedAddress === address) {
        setIsAuthenticated(true);
        return;
      }

      // If the user is connected but not yet authenticated, perform the login
      if (isConnected && address) {
        try {
          await authenticateWithBackend(address);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Authentication failed:", error);
          setIsAuthenticated(false);
        }
      } else {
        // If disconnected, ensure the isAuthenticated state is false
        setIsAuthenticated(false);
      }
    };

    handleAuthentication();
  }, [isConnected, address, signMessageAsync]);

  // Initialize app metadata (existing code)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = appMetadata.name;

      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", appMetadata.description);
      } else {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        metaDescription.setAttribute("content", appMetadata.description);
        document.getElementsByTagName("head")[0].appendChild(metaDescription);
      }

      let link = document.querySelector('link[rel="icon"]');
      if (link) {
        link.setAttribute("href", appMetadata.icon);
      } else {
        link = document.createElement("link");
        link.setAttribute("rel", "icon");
        link.setAttribute("href", appMetadata.icon);
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    }
  }, []);

  // Updated disconnect function to also clear the token from local storage
  const disconnectWallet = () => {
    disconnect();
    setAccountMenuOpen(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("walletAddress");
    setIsAuthenticated(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance: any) => {
    if (!balance) return "0.00";
    const value = parseFloat(balance.formatted);
    return value.toFixed(4);
  };

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
            <Link
              href="/demo"
              className="hover:text-yellow-600 transition-colors"
            >
              Demo
            </Link>

            <Link
              href="/governance"
              className="hover:text-yellow-600 transition-colors"
            >
              Governance
            </Link>
            <Link
              href="/insurance"
              className="hover:text-yellow-600 transition-colors"
            >
              Insurance
            </Link>
            <Link
              href="/admin"
              className="hover:text-yellow-600 transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/compliance"
              className="hover:text-yellow-600 transition-colors"
            >
              Compliance
            </Link>
            {isConnected && isAuthenticated && (
              <Link
                href="/portfolio"
                className="hover:text-yellow-600 font-semibold transition-colors"
              >
                My Portfolio
              </Link>
            )}

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-4">
                {/* Submit Property Button - Fixed URL */}
                <Link
                  href="/submit"
                  className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-gray-700 transition-colors font-medium"
                >
                  Submit Property
                </Link>

                {/* Account Info */}
                <div className="relative">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white"
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 via-orange-600 to-gray-900 flex items-center justify-center text-white text-sm font-medium
"
                    >
                      {address ? address.slice(2, 4).toUpperCase() : "??"}
                    </div>

                    {/* Address and Balance */}
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {address ? formatAddress(address) : ""}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatBalance(balance)} HBAR
                      </div>
                    </div>

                    {/* Dropdown arrow */}
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <div className="text-sm font-medium text-gray-800">
                          {address ? formatAddress(address) : ""}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Balance: {formatBalance(balance)} HBAR
                        </div>
                      </div>

                      <Link
                        href="/portfolio"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        My Portfolio
                      </Link>

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(address || "")
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Copy Address
                      </button>

                      <hr className="my-2" />

                      <button
                        onClick={disconnectWallet}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="px-6 py-2 rounded-lg bg-white border border-gray-300 text-black hover:bg-gray-50 transition-colors font-medium"
                            >
                              Connect Wallet
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 focus:outline-none hover:text-gray-800 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t border-gray-100">
          <Link
            href="/demo"
            className="block py-2 hover:text-yellow-600 transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/escrow"
            className="block py-2 hover:text-yellow-600 transition-colors"
          >
            Escrow
          </Link>
          <Link
            href="/governance"
            className="block py-2 hover:text-yellow-600 transition-colors"
          >
            Governance
          </Link>
          <Link
            href="/insurance"
            className="block py-2 hover:text-yellow-600 transition-colors"
          >
            Insurance
          </Link>
          <Link
            href="/compliance"
            className="block py-2 hover:text-yellow-600 transition-colors"
          >
            Compliance
          </Link>
          {isConnected && isAuthenticated && (
            <Link
              href="/portfolio"
              className="block py-2 hover:text-yellow-600 font-semibold transition-colors"
            >
              My Portfolio
            </Link>
          )}

          {isConnected ? (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {/* Account Info Mobile */}
              <div className="flex items-center space-x-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 via-orange-600 to-gray-900 flex items-center justify-center text-white text-sm font-medium">
                  {address ? address.slice(2, 4).toUpperCase() : "??"}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {address ? formatAddress(address) : ""}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatBalance(balance)} HBAR
                  </div>
                </div>
              </div>

              <Link
                href="/submit"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 via-orange-600 to-gray-900 flex items-center justify-center text-white text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Submit Property
              </Link>

              <button
                onClick={() => navigator.clipboard.writeText(address || "")}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Copy Address
              </button>

              <button
                onClick={() => {
                  disconnectWallet();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-100">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={() => {
                                openConnectModal();
                                setMenuOpen(false);
                              }}
                              type="button"
                              className="w-full px-6 py-3 rounded-lg bg-white border border-gray-300 text-black hover:bg-gray-50 transition-colors font-medium"
                            >
                              Connect Wallet
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {accountMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setAccountMenuOpen(false)}
        />
      )}
    </nav>
  );
}
