import "server-only";

import { fetchTransaction } from "./tx-fetcher";
import { getHistoricalPrice } from "./historical-oracle";
import { parseTokenTransferAmount } from "./token-parser";
import { multiplyDecimalStringByUsdPrice } from "./usd-math";
import type { ReceiptData } from "./types";

export async function processTransaction(
  txHash: string,
  asset: "rBTC" | "rUSDT" = "rBTC"
): Promise<ReceiptData> {
  const tx = await fetchTransaction(txHash);
  const priceData = await getHistoricalPrice(asset, tx.timestamp);

  let valueFormatted: string;

  if (asset === "rUSDT") {
    const tokenAmount = parseTokenTransferAmount(tx.logs, 6);
    if (!tokenAmount) {
      throw new Error(
        "No rUSDT transfer found in this transaction. Make sure it's an ERC-20 rUSDT transfer."
      );
    }
    valueFormatted = tokenAmount;
  } else {
    valueFormatted = tx.valueFormatted;
  }

  const usdValue = multiplyDecimalStringByUsdPrice(
    valueFormatted,
    priceData.usdPrice
  );

  return {
    ...tx,
    valueFormatted,
    usdValue,
    asset,
  };
}
