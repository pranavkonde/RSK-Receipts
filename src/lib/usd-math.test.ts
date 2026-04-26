import { describe, expect, it } from "vitest";
import { formatEther } from "viem";
import { multiplyDecimalStringByUsdPrice } from "./usd-math";

describe("multiplyDecimalStringByUsdPrice", () => {
  it("multiplies typical amounts", () => {
    expect(multiplyDecimalStringByUsdPrice("1.5", 2)).toBe(3);
    expect(multiplyDecimalStringByUsdPrice("0.001", 1000)).toBe(1);
  });

  it("preserves precision where parseFloat on the amount would diverge", () => {
    const wei = 10n ** 72n + 777n;
    const etherStr = formatEther(wei);
    const viaParseFloat = parseFloat(etherStr) * 50_000;
    const viaDecimal = multiplyDecimalStringByUsdPrice(etherStr, 50_000);
    expect(viaDecimal).not.toBe(viaParseFloat);
    expect(Number.isFinite(viaDecimal)).toBe(true);
  });

  it("handles large wei-derived ether strings from formatEther", () => {
    const wei = 10n ** 30n;
    const etherStr = formatEther(wei);
    const usd = multiplyDecimalStringByUsdPrice(etherStr, 50_000);
    expect(usd).toBeGreaterThan(0);
    expect(Number.isFinite(usd)).toBe(true);
  });
});
