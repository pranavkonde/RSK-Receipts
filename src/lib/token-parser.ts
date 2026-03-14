import type { Log } from "viem";

// ERC-20 Transfer(address,address,uint256) topic
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" as const;

/**
 * Parse ERC-20 Transfer event amount from log data.
 * USDT/rUSDT uses 6 decimals.
 */
export function parseTokenTransferAmount(
  logs: Log[] | undefined,
  decimals: number = 6
): string | null {
  if (!logs?.length) return null;

  for (const log of logs) {
    if (log.topics[0] === TRANSFER_TOPIC && log.data) {
      const value = BigInt(log.data as `0x${string}`);
      const formatted = Number(value) / Math.pow(10, decimals);
      return formatted.toFixed(decimals);
    }
  }

  return null;
}
