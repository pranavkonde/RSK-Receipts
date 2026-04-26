import { describe, expect, it } from "vitest";
import { assertValidTxHash } from "./tx-hash";

describe("assertValidTxHash", () => {
  const valid =
    "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789" as const;

  it("accepts a valid 0x-prefixed hash", () => {
    expect(assertValidTxHash(valid)).toBe(valid);
  });

  it("accepts 64 hex chars without 0x and normalizes", () => {
    const noPrefix =
      "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";
    expect(assertValidTxHash(noPrefix)).toBe(`0x${noPrefix}`);
  });

  it("trims whitespace", () => {
    expect(assertValidTxHash(`  ${valid}  `)).toBe(valid);
  });

  it("rejects wrong length", () => {
    expect(() => assertValidTxHash("0xabc")).toThrow(/Invalid transaction hash/);
  });

  it("rejects non-hex", () => {
    const bad = `0x${"g".repeat(64)}`;
    expect(() => assertValidTxHash(bad)).toThrow(/Invalid transaction hash/);
  });
});
