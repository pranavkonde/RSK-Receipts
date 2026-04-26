import Decimal from "decimal.js";

/**
 * Multiply an exact decimal amount string (e.g. from formatEther or token formatting)
 * by a USD unit price. Avoids parseFloat precision loss on the amount.
 */
export function multiplyDecimalStringByUsdPrice(
  amountAsDecimalString: string,
  usdPrice: number
): number {
  return new Decimal(amountAsDecimalString).mul(usdPrice).toNumber();
}
