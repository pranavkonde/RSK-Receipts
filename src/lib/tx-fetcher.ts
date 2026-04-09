import "server-only";

import { createPublicClient, http, formatEther } from "viem";
import { rootstock } from "viem/chains";
import type { TransactionData } from "./types";
import { ROOTSTOCK_RPC_URL } from "./config";

const client = createPublicClient({
  chain: rootstock,
  transport: http(ROOTSTOCK_RPC_URL),
});

const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

export function assertValidTxHash(input: string): `0x${string}` {
  const trimmed = input.trim();
  const normalized = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
  if (!TX_HASH_REGEX.test(normalized)) {
    throw new Error(
      "Invalid transaction hash: expected 64 hexadecimal characters (optional 0x prefix)."
    );
  }
  return normalized as `0x${string}`;
}

export async function fetchTransaction(txHash: string): Promise<TransactionData> {
  const hash = assertValidTxHash(txHash);

  const [tx, receipt] = await Promise.all([
    client.getTransaction({ hash }),
    client.getTransactionReceipt({ hash }),
  ]);

  if (!tx) {
    throw new Error("Transaction not found. Please check the transaction hash.");
  }

  if (tx.blockNumber == null) {
    throw new Error(
      "This transaction is still pending. Wait for block confirmation before generating a receipt."
    );
  }

  if (!receipt) {
    throw new Error(
      "No receipt found. The transaction may still be pending or was dropped from the network."
    );
  }

  const blockData = await client.getBlock({
    blockNumber: tx.blockNumber,
  });

  const value = tx.value;
  const gasUsed = receipt.gasUsed;
  const gasPrice = receipt.effectiveGasPrice ?? tx.gasPrice ?? BigInt(0);
  const timestamp = Number(blockData.timestamp);

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value,
    valueFormatted: formatEther(value),
    gasUsed,
    gasPrice,
    blockNumber: tx.blockNumber,
    timestamp,
    blockTimestamp: new Date(timestamp * 1000),
    status: receipt.status === "success" ? "success" : "reverted",
    logs: receipt.logs,
  };
}
