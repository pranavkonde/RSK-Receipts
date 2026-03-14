import { fetchTransaction } from "./tx-fetcher";
import { getHistoricalPrice } from "./historical-oracle";
import { generateReceiptPdf } from "./pdf-generator";
import { parseTokenTransferAmount } from "./token-parser";
import type { ReceiptData, TransactionData } from "./types";

export async function processTransaction(
  txHash: string,
  asset: "rBTC" | "rUSDT" = "rBTC"
): Promise<ReceiptData> {
  const tx = await fetchTransaction(txHash);
  const priceData = await getHistoricalPrice(asset, tx.timestamp);

  let amount: number;
  let valueFormatted: string;

  if (asset === "rUSDT") {
    const tokenAmount = parseTokenTransferAmount(tx.logs, 6);
    if (!tokenAmount) {
      throw new Error(
        "No rUSDT transfer found in this transaction. Make sure it's an ERC-20 rUSDT transfer."
      );
    }
    valueFormatted = tokenAmount;
    amount = parseFloat(tokenAmount);
  } else {
    valueFormatted = tx.valueFormatted;
    amount = parseFloat(tx.valueFormatted);
  }

  const usdValue = amount * priceData.usdPrice;

  const receipt: ReceiptData = {
    ...tx,
    valueFormatted,
    usdValue,
    asset,
  };

  return receipt;
}

export { fetchTransaction, getHistoricalPrice, generateReceiptPdf };
export type { ReceiptData, TransactionData };
