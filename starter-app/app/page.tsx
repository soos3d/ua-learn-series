"use client";

/* 
Initialize Universal Account
*/

import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Universal Accounts imports
import { UniversalAccount } from "@GDdark/universal-account";

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // State for Universal Account
  const [universalAccount, setUniversalAccount] =
    useState<UniversalAccount | null>(null);

  /**
   * Step 1: Connect Wallet
   * Handles the connection to a browser wallet and requests account access
   */
  const connectWallet = async () => {
    try {
      // Check if window.ethereum exists (MetaMask or other browser wallet)
      if (typeof window.ethereum === "undefined") {
        setError("No browser wallet detected. Please install one.");
        return;
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get the signer (connected account)
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Update state with account information
      setAccount(address);
      setIsConnected(true);
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      setError("Failed to connect. Please try again.");
    }
  };

  /**
   * Step 2: Initialize Universal Account
   * Creates a new Universal Account instance when a wallet is connected
   */
  useEffect(() => {
    if (isConnected) {
      if (!process.env.NEXT_PUBLIC_UA_PROJECT_ID) {
        setError("No project ID detected. Please add one.");
        return;
      }

      const ua = new UniversalAccount({
        projectId: process.env.NEXT_PUBLIC_UA_PROJECT_ID,
        ownerAddress: account,
        tradeConfig: {
          universalGas: true,
          // slippageBps: 100 // 1%
        },
      });

      console.log(ua);
      setUniversalAccount(ua);
    }
  }, [isConnected, account]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Ethers.js Browser Wallet Demo</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-slate-700 p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Wallet Connected</h2>
          <div className="mb-2">
            <span className="font-medium">Account: </span>
            <span className="font-mono break-all text-sm">{account}</span>
          </div>
          <button
            onClick={() => {
              setAccount("");
              setIsConnected(false);
            }}
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>
          This is a simple example of connecting to a browser wallet using
          ethers.js
        </p>
      </div>
    </div>
  );
}
