"use server";

import { processTransaction as buildReceipt } from "@/lib/receipt-service";
import type { ReceiptData, ReceiptDataClient } from "@/lib/types";

function serializeReceipt(r: ReceiptData): ReceiptDataClient {
  return {
    hash: r.hash,
    from: r.from,
    to: r.to,
    value: r.value.toString(),
    valueFormatted: r.valueFormatted,
    gasUsed: r.gasUsed.toString(),
    gasPrice: r.gasPrice.toString(),
    blockNumber: r.blockNumber.toString(),
    timestamp: r.timestamp,
    blockTimestamp: r.blockTimestamp.toISOString(),
    status: r.status,
    usdValue: r.usdValue,
    asset: r.asset,
  };
}

export async function processTransaction(
  txHash: string,
  asset: "rBTC" | "rUSDT" = "rBTC"
): Promise<ReceiptDataClient> {
  const r = await buildReceipt(txHash, asset);
  return serializeReceipt(r);
}
