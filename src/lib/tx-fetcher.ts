import { createPublicClient, http, formatEther } from "viem";
import { rootstock } from "viem/chains";
import type { TransactionData } from "./types";
import { ROOTSTOCK_RPC_URL } from "./config";

const client = createPublicClient({
  chain: rootstock,
  transport: http(ROOTSTOCK_RPC_URL),
});

export async function fetchTransaction(txHash: string): Promise<TransactionData> {
  const hash = txHash.startsWith("0x") ? txHash : `0x${txHash}`;

  const [tx, receipt] = await Promise.all([
    client.getTransaction({ hash: hash as `0x${string}` }),
    client.getTransactionReceipt({ hash: hash as `0x${string}` }),
  ]);

  if (!tx) {
    throw new Error("Transaction not found. Please check the transaction hash.");
  }

  // Fetch block for timestamp
  const blockData = await client.getBlock({
    blockNumber: tx.blockNumber!,
  });

  const receiptData = receipt!;
  const value = tx.value;
  const gasUsed = receiptData.gasUsed;
  const gasPrice = receiptData.effectiveGasPrice ?? tx.gasPrice ?? BigInt(0);
  const timestamp = Number(blockData.timestamp);

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value,
    valueFormatted: formatEther(value),
    gasUsed,
    gasPrice,
    blockNumber: tx.blockNumber!,
    timestamp,
    blockTimestamp: new Date(timestamp * 1000),
    status: receiptData.status === "success" ? "success" : "reverted",
    logs: receiptData.logs,
  };
}
