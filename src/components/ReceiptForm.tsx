"use client";

import { useState } from "react";
import { processTransaction, generateReceiptPdf } from "@/lib";
import type { ReceiptData } from "@/lib/types";

export function ReceiptForm() {
  const [txHash, setTxHash] = useState("");
  const [asset, setAsset] = useState<"rBTC" | "rUSDT">("rBTC");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setReceipt(null);
    if (!txHash.trim()) return;

    setLoading(true);
    try {
      const data = await processTransaction(txHash.trim(), asset);
      setReceipt(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadPdf() {
    if (receipt) {
      generateReceiptPdf(receipt);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="txHash"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Rootstock Transaction Hash (TxHash)
          </label>
          <input
            id="txHash"
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Asset Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="asset"
                value="rBTC"
                checked={asset === "rBTC"}
                onChange={() => setAsset("rBTC")}
                className="text-amber-500 focus:ring-amber-500"
              />
              <span>rBTC (native transfer)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="asset"
                value="rUSDT"
                checked={asset === "rUSDT"}
                onChange={() => setAsset("rUSDT")}
                className="text-amber-500 focus:ring-amber-500"
              />
              <span>rUSDT (token transfer)</span>
            </label>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            For native RBTC transfers, use rBTC. For ERC-20 token transfers
            (e.g. rUSDT), use rUSDT.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          {loading ? "Fetching transaction..." : "Generate Receipt"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {receipt && (
        <div className="mt-8 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Receipt Preview
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-zinc-500">Amount</dt>
              <dd className="font-medium">
                {receipt.valueFormatted} {receipt.asset}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">USD Value (at tx time)</dt>
              <dd className="font-medium">${receipt.usdValue.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Date</dt>
              <dd className="font-mono text-xs">
                {receipt.blockTimestamp.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">From → To</dt>
              <dd className="font-mono text-xs truncate">
                {receipt.from.slice(0, 8)}... → {receipt.to?.slice(0, 8) ?? "..."}
              </dd>
            </div>
          </dl>
          <button
            onClick={handleDownloadPdf}
            className="mt-6 w-full py-3 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF Receipt
          </button>
        </div>
      )}
    </div>
  );
}
