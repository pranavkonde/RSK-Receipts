import type { Log } from "viem";

// ERC-20 Transfer(address,address,uint256) topic
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" as const;

function pow10(decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 100) {
    throw new RangeError("decimals must be an integer from 0 to 100");
  }
  let result = BigInt(1);
  const ten = BigInt(10);
  for (let i = 0; i < decimals; i++) {
    result *= ten;
  }
  return result;
}

export function formatTokenAmountFromRaw(raw: bigint, decimals: number): string {
  const base = pow10(decimals);
  const whole = raw / base;
  const frac = raw % base;
  if (decimals === 0) {
    return whole.toString();
  }
  const fracPadded = frac.toString().padStart(decimals, "0");
  return `${whole.toString()}.${fracPadded}`;
}

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
      return formatTokenAmountFromRaw(value, decimals);
    }
  }

  return null;
}
