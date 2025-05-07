"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Function to connect to a browser wallet
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
