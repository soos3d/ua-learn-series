"use client";

/* 
Initialize Universal Account
*/

import { useState, useEffect, useCallback } from "react";
import { ethers, getBytes } from "ethers";

// Universal Accounts imports
import {
  UniversalAccount,
  IAssetsResponse,
  SUPPORTED_TOKEN_TYPE,
  CHAIN_ID,
} from "@particle-network/universal-account-sdk";

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // State for Universal Account
  const [universalAccount, setUniversalAccount] =
    useState<UniversalAccount | null>(null);

  // States for addresses, assets
  const [accountInfo, setAccountInfo] = useState<{
    ownerAddres: string;
    evmSmartAccount: string;
    solanaSmartAccount: string;
  } | null>(null);

  const [primaryAssets, setPrimaryAssets] = useState<IAssetsResponse | null>(
    null
  );

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

  // Fetch addresses and assets
  const fetchAddressesAndAssets = useCallback(async () => {
    if (!universalAccount) return;

    // Fetch the addresses
    const universalAccountData =
      await universalAccount.getSmartAccountOptions();
    console.log(universalAccountData);

    setAccountInfo({
      ownerAddres: account,
      evmSmartAccount: universalAccountData.smartAccountAddress || "",
      solanaSmartAccount: universalAccountData.solanaSmartAccountAddress || "",
    });

    // Fetch the assets
    const assets = await universalAccount.getPrimaryAssets();
    console.log(JSON.stringify(assets, null, 2));

    setPrimaryAssets(assets);
  }, [universalAccount, account]);

  useEffect(() => {
    fetchAddressesAndAssets();
  }, [fetchAddressesAndAssets]);

  /**
   * Step 3: Send a transaction
   * Sends a convert transaction
   */
  const convertTransaction = async () => {
    if (!universalAccount) return;

    // Build transaction
    const transaction = await universalAccount.createConvertTransaction({
      expectToken: { type: SUPPORTED_TOKEN_TYPE.USDC, amount: "1" },
      chainId: CHAIN_ID.SOLANA_MAINNET,
    });

    // Send transaction
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(getBytes(transaction.rootHash));

    const sendResults = await universalAccount.sendTransaction(
      transaction,
      signature
    );
    console.log(sendResults);
    alert(
      `explorer url https://universalx.app/activity/details?id=${sendResults.transactionId}`
    );
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
            <p className="mb-2">
              <span className="font-medium">EVM Universal Address: </span>
              <span className="font-mono break-all text-sm">
                {accountInfo?.evmSmartAccount}
              </span>
            </p>
            <p>
              <span className="font-medium">Solana Universal Address: </span>
              <span className="font-mono break-all text-sm">
                {accountInfo?.solanaSmartAccount}
              </span>
            </p>
            <p className="mt-2">
              <span className="mt-2">Universal Balance: </span>
              <span className="mt-2">$ {primaryAssets?.totalAmountInUSD}</span>
              <button
                className="ml-2"
                onClick={() => fetchAddressesAndAssets()}
              >
                🔁
              </button>
            </p>
            <p className="mt-2 ">
              <button
                className="p-4 border "
                onClick={() => convertTransaction()}
              >
                Get 1 USDC on Solana
              </button>
            </p>
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
