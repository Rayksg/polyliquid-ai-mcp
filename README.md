# PolyLiquid AI — Hyperliquid & Polymarket Cross-Market Terminal + x402 MCP Server

**Live Web Terminal:** [https://rayksg.github.io/polyliquid-ai-mcp/](https://rayksg.github.io/polyliquid-ai-mcp/)

PolyLiquid AI is a cross-market analytics terminal and Model Context Protocol (MCP) server for **Hyperliquid (Perps & HIP-4 Outcome Markets)** and **Polymarket (CLOB V2)**, featuring **Coinbase x402** USDC micropayments on Base and zero-private-key EIP-712 order attribution.

## Tools

- `get_hyperliquid_live_market` (Free): Fetches real-time Hyperliquid L2 order book depth, mark price, and Tier 0 Maker/Taker fee rates (`0.015%` ALO Maker / `0.045%` Market Taker).
- `compare_hip4_vs_polymarket` (Free): Compares binary contract odds and fees across Hyperliquid HIP-4 (`0%` open fee) and Polymarket CLOB V2 (`1.56%–1.80%` peak 15-minute crypto taker fee).
- `generate_pro_trade_setup` (`$0.02 USDC` via Coinbase x402 on Base): Generates risk-audited micro-account (`$500–$1,000`) trade setups with exact Entry Zone, Stop-Loss (`SL`), Take-Profit (`TP1`/`TP2`), net fee calculation, liquidation price, and a self-custodial EIP-712 signing payload.
- `audit_polymarket_resolution_trap` (`$0.02 USDC` via Coinbase x402 on Base): Audits Polymarket UMA Optimistic Oracle resolution clauses and cross-venue discrepancies before placing a bet.

## Quick Start

```bash
npm install
npm start
```

## Live Web App
Use the full browser calculator and MCP generator without installing anything:
https://rayksg.github.io/polyliquid-ai-mcp/
