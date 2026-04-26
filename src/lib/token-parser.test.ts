import { describe, expect, it } from "vitest";
import type { Log } from "viem";
import {
  formatTokenAmountFromRaw,
  parseTokenTransferAmount,
  pow10,
} from "./token-parser";

describe("pow10", () => {
  it("returns 1 for zero decimals", () => {
    expect(pow10(0)).toBe(1n);
  });

  it("returns 10^n", () => {
    expect(pow10(6)).toBe(1_000_000n);
    expect(pow10(18)).toBe(10n ** 18n);
  });

  it("rejects invalid decimals", () => {
    expect(() => pow10(-1)).toThrow(RangeError);
    expect(() => pow10(101)).toThrow(RangeError);
    expect(() => pow10(1.5)).toThrow(RangeError);
  });
});

describe("formatTokenAmountFromRaw", () => {
  it("formats fractional amounts with padding", () => {
    expect(formatTokenAmountFromRaw(1000n, 6)).toBe("0.001000");
    expect(formatTokenAmountFromRaw(1n, 6)).toBe("0.000001");
  });

  it("formats whole amounts", () => {
    expect(formatTokenAmountFromRaw(5_000_000n, 6)).toBe("5.000000");
  });

  it("handles zero decimals", () => {
    expect(formatTokenAmountFromRaw(42n, 0)).toBe("42");
  });

  it("handles large bigint values without precision loss", () => {
    const raw = 10n ** 24n + 1n;
    const s = formatTokenAmountFromRaw(raw, 18);
    expect(s).toBe("1000000.000000000000000001");
  });
});

describe("parseTokenTransferAmount", () => {
  const transferTopic =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" as const;

  function transferLog(amountHex: `0x${string}`): Log {
    return {
      address: "0x0000000000000000000000000000000000000001",
      blockHash: null,
      blockNumber: null,
      data: amountHex,
      logIndex: 0,
      transactionHash: null,
      transactionIndex: null,
      removed: false,
      topics: [
        transferTopic,
        "0x000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "0x000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      ],
    } as Log;
  }

  it("returns null when logs are missing or empty", () => {
    expect(parseTokenTransferAmount(undefined)).toBeNull();
    expect(parseTokenTransferAmount([])).toBeNull();
  });

  it("parses the first Transfer log", () => {
    const logs = [
      transferLog(
        "0x00000000000000000000000000000000000000000000000000000000000003e8"
      ),
    ];
    expect(parseTokenTransferAmount(logs, 6)).toBe("0.001000");
  });

  it("uses default 6 decimals", () => {
    const logs = [
      transferLog(
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ),
    ];
    expect(parseTokenTransferAmount(logs)).toBe("0.000001");
  });
});
