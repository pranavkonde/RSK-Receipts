export interface TransactionData {
  hash: string;
  from: string;
  to: string | null;
  value: bigint;
  valueFormatted: string;
  gasUsed: bigint;
  gasPrice: bigint;
  blockNumber: bigint;
  timestamp: number;
  blockTimestamp: Date;
  status: "success" | "reverted";
  logs?: import("viem").Log[];
}

export interface HistoricalPrice {
  usdPrice: number;
  timestamp: number;
  asset: "rBTC" | "rUSDT";
}

export interface ReceiptData extends TransactionData {
  usdValue: number;
  asset: "rBTC" | "rUSDT";
}

export interface ReceiptDataClient {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  valueFormatted: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: string;
  timestamp: number;
  blockTimestamp: string;
  status: "success" | "reverted";
  usdValue: number;
  asset: "rBTC" | "rUSDT";
}
