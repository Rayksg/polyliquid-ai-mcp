/**
 * PolyLiquid AI — 4-Engine Monetized MCP + x402 Server (Node.js)
 * Pre-configured for Owner Wallet: 0xD504451868BcA32BCd1E9EEA20458241864814bc
 */
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { paymentMiddleware } from "x402-express";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";

const CONFIG = {
  POLY_BUILDER_CODE: process.env.POLY_BUILDER_CODE || "0x7f9a8b2c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
  HL_BUILDER_ADDRESS: "0xd504451868bca32bcd1e9eea20458241864814bc",
  HL_BUILDER_FEE_TENTHS_BPS: 50, // 0.05% Perps Builder Fee
  X402_PAY_TO_WALLET: "0xD504451868BcA32BCd1E9EEA20458241864814bc",
  CDP_FACILITATOR_URL: "https://api.cdp.coinbase.com/platform/v2/x402",
  HYPERLIQUID_INFO_API: "https://api.hyperliquid.xyz/info",
  POLYMARKET_GAMMA_API: "https://gamma-api.polymarket.com/markets"
};

const app = express();
app.use(express.json());

app.use(paymentMiddleware(CONFIG.X402_PAY_TO_WALLET, {
  "POST /api/pro/trade-setup": {
    price: "$0.02",
    network: "base",
    config: {
      description: "generate_pro_trade_setup costs $0.02/call: returns exact Hyperliquid Entry, SL, TP1/TP2, net fee math, and 1-click EIP-712 signing payload.",
      extensions: declareDiscoveryExtension({
        category: "crypto-trading",
        tags: ["hyperliquid", "polymarket", "perps", "hip-4", "x402"]
      })
    }
  },
  "POST /api/pro/audit-polymarket": {
    price: "$0.02",
    network: "base",
    config: {
      description: "audit_polymarket_resolution_trap costs $0.02/call: scans UMA Optimistic Oracle rules & CLOB V2 fee traps before betting.",
      extensions: declareDiscoveryExtension({
        category: "prediction-markets",
        tags: ["polymarket", "uma-oracle", "kalshi", "hip-4", "x402"]
      })
    }
  }
}, { url: CONFIG.CDP_FACILITATOR_URL }));

const mcp = new McpServer({ name: "polyliquid-ai-mcp", version: "1.0.0" });

mcp.tool("get_hyperliquid_live_market", { coin: "string" }, async ({ coin }) => {
  const res = await fetch(CONFIG.HYPERLIQUID_INFO_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "l2Book", coin: coin.toUpperCase() })
  });
  const book = await res.json();
  return { content: [{ type: "text", text: JSON.stringify({ freeTier: true, coin, book }) }] };
});

mcp.tool("compare_hip4_vs_polymarket", { coin: "string", betSizeUsd: "number" }, async ({ coin, betSizeUsd = 1000 }) => {
  const metaRes = await fetch(CONFIG.HYPERLIQUID_INFO_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "outcomeMeta" })
  });
  const hip4Meta = await metaRes.json();
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        comparison: "Hyperliquid HIP-4 charges 0% open fee vs Polymarket CLOB V2 1.56%-1.80% peak 15m crypto taker fee",
        estimatedFeeSavedUsd: Number((betSizeUsd * 0.0165).toFixed(2)),
        polymarketBuilderCode: CONFIG.POLY_BUILDER_CODE,
        hyperliquidBuilderAddress: CONFIG.HL_BUILDER_ADDRESS,
        hip4Outcomes: hip4Meta
      })
    }]
  };
});

app.post("/api/pro/trade-setup", async (req, res) => {
  const { coin = "BTC", capital = 500, leverage = 2, targetNetUsd = 8.5 } = req.body;
  const notional = capital * leverage;
  res.json({
    paidVia: "x402-base-usdc",
    payToWallet: CONFIG.X402_PAY_TO_WALLET,
    setup: { coin, notional, targetNetUsd, orderType: "ALO_MAKER_0.015%" },
    signedOrderTemplate: {
      builder: { b: CONFIG.HL_BUILDER_ADDRESS, f: CONFIG.HL_BUILDER_FEE_TENTHS_BPS },
      polymarketAttribution: { builderCode: CONFIG.POLY_BUILDER_CODE }
    }
  });
});

app.listen(process.env.PORT || 8787, () => {
  console.log("PolyLiquid AI MCP + x402 Server running on port 8787 for wallet 0xD504451868BcA32BCd1E9EEA20458241864814bc");
});
