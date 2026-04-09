# RSK Receipts- The Web3 Bookkeeper

A utility for Web3 freelancers and DAOs on the Rootstock blockchain. Input a Rootstock transaction hash and get a printable PDF receipt with historical USD value for tax and accounting purposes.

**Zero smart contracts.** Transaction data and pricing are resolved on the server; the PDF is generated in the browser.

## Features

- **Tx Fetcher**- Retrieve transaction details (sender, receiver, amount, gas, timestamp) via Rootstock RPC
- **Historical Oracle**- Fetch historical rBTC/rUSDT USD price at the exact transaction time via CoinGecko API
- **PDF Generator**- Create professional, printable receipt PDFs with jspdf

## Tech Stack

- React + Next.js
- Viem (Rootstock RPC)
- CoinGecko API (historical prices)
- jspdf + jspdf-autotable (PDF generation)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Paste a Rootstock transaction hash (TxHash)
2. Select asset type: **rBTC** for native transfers, **rUSDT** for ERC-20 token transfers
3. Click **Generate Receipt**
4. Download the PDF receipt

## Optional: CoinGecko API Key

The free CoinGecko API has a rate limit of 5–15 calls/minute. For higher limits (30/min), add a Demo API key:

1. Create a free account at [CoinGecko API](https://www.coingecko.com/en/api/pricing)
2. Copy `.env.example` to `.env.local`
3. Add `COINGECKO_API_KEY=your_key` (server-only; never use `NEXT_PUBLIC_` for API keys)

## Supported Assets

- **rBTC**- Native Rootstock Bitcoin (1:1 peg with BTC)
- **rUSDT**- ERC-20 USDT on Rootstock (parses Transfer events)

## Note on Historical Data

CoinGecko's free tier supports historical data for the **last 365 days** only. Older transactions may not return price data.
