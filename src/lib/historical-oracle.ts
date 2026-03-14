import { COINGECKO_BASE_URL, COINGECKO_API_KEY } from "./config";
import type { HistoricalPrice } from "./types";

/**
 * Fetch historical USD price for rBTC at a specific timestamp.
 * rBTC is pegged 1:1 to BTC, so we use Bitcoin's price.
 */
export async function getHistoricalRbtcPrice(
  timestamp: number
): Promise<HistoricalPrice> {
  const from = Math.floor(timestamp) - 300; // 5 min before
  const to = Math.floor(timestamp) + 300; // 5 min after

  const url = new URL(
    `${COINGECKO_BASE_URL}/coins/bitcoin/market_chart/range`
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

  const data = (await res.json()) as {
    prices: [number, number][];
  };

  const prices = data.prices;
  if (!prices?.length) {
    throw new Error(
      "No historical price data available for this date. CoinGecko free tier supports last 365 days only."
    );
  }

  // Find closest price to our timestamp (prices are [timestamp_ms, price])
  const targetMs = timestamp * 1000;
  const closest = prices.reduce((prev, curr) =>
    Math.abs(curr[0] - targetMs) < Math.abs(prev[0] - targetMs) ? curr : prev
  );

  return {
    usdPrice: closest[1],
    timestamp: Math.floor(closest[0] / 1000),
    asset: "rBTC",
  };
}

/**
 * Fetch historical USD price for rUSDT at a specific timestamp.
 * USDT is pegged to ~$1, but we fetch actual market price for accuracy.
 */
export async function getHistoricalRusdtPrice(
  timestamp: number
): Promise<HistoricalPrice> {
  const from = Math.floor(timestamp) - 300;
  const to = Math.floor(timestamp) + 300;

  const url = new URL(
    `${COINGECKO_BASE_URL}/coins/tether/market_chart/range`
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

  const data = (await res.json()) as {
    prices: [number, number][];
  };

  const prices = data.prices;
  if (!prices?.length) {
    // USDT typically ~$1; fallback if no data
    return {
      usdPrice: 1,
      timestamp,
      asset: "rUSDT",
    };
  }

  const targetMs = timestamp * 1000;
  const closest = prices.reduce((prev, curr) =>
    Math.abs(curr[0] - targetMs) < Math.abs(prev[0] - targetMs) ? curr : prev
  );

  return {
    usdPrice: closest[1],
    timestamp: Math.floor(closest[0] / 1000),
    asset: "rUSDT",
  };
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
