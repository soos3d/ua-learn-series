# Universal Accounts Learn Series

A project that walks you through building **chain-abstracted dApps** with the **Universal Accounts SDK**.

> 📚 **Background:** If you’re new to chain abstraction or Universal Accounts, check the [docs](https://uasdev.mintlify.app/intro/what-is-cha) first.

## Table of Contents
1. [Why This Series?](#why-this-series)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Roadmap](#step-by-step-roadmap)
4. [Quick Start](#quick-start)

## Why This Series?

This series is a collection of steps to help you understand how to build chain abstracted apps with Universal Accounts.

Read the complete guide on the [Learn Series page](https://uasdev.mintlify.app/learn/series/ua-learn-series).

> The starter app is a Next.js app with a basic implementation of a browser provider using ethers.js.

## Prerequisites
- **Node.js** ≥ 23
- **Yarn** ≥ 1.22
- A browser wallet (e.g., **MetaMask**)

## Step-by-Step Roadmap

1. **Connect** to the dApp with a provider.
2. **Initialize** the Universal Account (UA) for the connected wallet.
3. **Use** the UA:
   - Fetch addresses and the **Universal Balance**.
   - Sign and send transactions.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Particle-FAFO/ua-learn-series.git
cd ua-learn-series

# 2. Go to the starter Next.js app
cd starter-app

# 3. Install dependencies
yarn install

# 4. Launch the dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
