import "server-only";

import { COINGECKO_BASE_URL, COINGECKO_API_KEY } from "./config";
import type { HistoricalPrice } from "./types";

type MarketChartResponse = {
  prices: [number, number][];
};

async function fetchHistoricalUsdFromRange(
  coinId: string,
  labelForErrors: string,
  timestamp: number
): Promise<{ usdPrice: number; timestamp: number }> {
  const from = Math.floor(timestamp) - 300;
  const to = Math.floor(timestamp) + 300;

  const url = new URL(
    `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(coinId)}/market_chart/range`
  );
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("from", from.toString());
  url.searchParams.set("to", to.toString());
  if (COINGECKO_API_KEY) {
    url.searchParams.set("x_cg_demo_api_key", COINGECKO_API_KEY);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(
      `CoinGecko API error: ${res.status}. Rate limit may be exceeded. Try again in a minute.`
    );
  }

  const data = (await res.json()) as MarketChartResponse;
  const prices = data.prices;
  if (!prices?.length) {
    throw new Error(
      `No historical price data for ${labelForErrors}. CoinGecko free tier supports roughly the last 365 days; a quoted USD value cannot be computed without market data.`
    );
  }

  const targetMs = timestamp * 1000;
  const closest = prices.reduce((prev, curr) =>
    Math.abs(curr[0] - targetMs) < Math.abs(prev[0] - targetMs) ? curr : prev
  );

  return {
    usdPrice: closest[1],
    timestamp: Math.floor(closest[0] / 1000),
  };
}

/**
 * Historical USD price for rBTC at a specific timestamp.
 * rBTC is pegged 1:1 to BTC, so we use Bitcoin's price.
 */
export async function getHistoricalRbtcPrice(
  timestamp: number
): Promise<HistoricalPrice> {
  const row = await fetchHistoricalUsdFromRange(
    "bitcoin",
    "Bitcoin (rBTC)",
    timestamp
  );
  return { usdPrice: row.usdPrice, timestamp: row.timestamp, asset: "rBTC" };
}

export async function getHistoricalRusdtPrice(
  timestamp: number
): Promise<HistoricalPrice> {
  const row = await fetchHistoricalUsdFromRange(
    "tether",
    "USDT (rUSDT)",
    timestamp
  );
  return { usdPrice: row.usdPrice, timestamp: row.timestamp, asset: "rUSDT" };
}

export async function getHistoricalPrice(
  asset: "rBTC" | "rUSDT",
  timestamp: number
): Promise<HistoricalPrice> {
  if (asset === "rBTC") {
    return getHistoricalRbtcPrice(timestamp);
  }
  return getHistoricalRusdtPrice(timestamp);
}
