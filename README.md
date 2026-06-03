# SignalForge

**SignalForge — Quant Strategy Research Platform**

A web-based quantitative strategy research and backtesting platform for building, testing, and interpreting rule-based equity strategies.

SignalForge helps users structure stock strategy ideas, run simulated backtests, compare benchmark performance, review risk metrics, and interpret strategy behavior before real market data integration.

## Current Status

SignalForge is a frontend MVP using simulated prototype data and client-side state. It is not a live trading system, financial advice, a trading recommendation, or a prediction of future performance.

## Key Features

- Strategy Builder
- Simulated Backtest Results
- Risk Metrics
- Benchmark Comparison
- Screener
- Trade / Rebalance Log
- Run History
- Run Comparison
- Parameter Sensitivity
- Stability Score
- Strategy Presets
- Research Notes Preview
- Dark / Light Mode

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- localStorage for prototype persistence
- Deterministic mock quant service layer

## Architecture

The UI is organized around typed strategy, screener, backtest, sensitivity, and research-note models. React components consume deterministic service boundaries that accept the current strategy configuration and return structured simulated results.

This keeps the current MVP lightweight while leaving a clear path to replace the deterministic prototype services with real historical market data, a backend quant engine, persistent user strategies, and AI-assisted research interpretation.

## Screenshots

Screenshots are not committed yet. Recommended captures for a portfolio README:

- Dashboard
- Strategy Builder
- Backtest Results
- Screener
- Research Notes
- Dark Mode

## Running Locally

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Run code quality checks:

```bash
npm run lint
npm run typecheck
```

Build the production app:

```bash
npm run build
```

The production build runs Next.js compilation plus its built-in lint and TypeScript validation. `npm run typecheck` is also available as a standalone TypeScript check.

## Deployment

SignalForge can be deployed on Vercel as a standard Next.js app. The current MVP does not require environment variables, backend services, databases, or market data API credentials.

## Current Routes

- `/`
- `/strategy-builder`
- `/backtest`
- `/screener`
- `/research-notes`

## Limitations

- Uses simulated prototype data only.
- No real market data API integration yet.
- No backend or database yet.
- No AI API integration yet.
- Not financial advice.
- Not a live trading system.

## Future Roadmap

- Real historical price data integration
- Actual indicator calculations
- Real backtesting engine
- FastAPI or backend service integration
- Persistent user strategies
- AI-assisted research interpretation
- Deployment and portfolio demo

## Portfolio Notes

SignalForge was built to demonstrate frontend architecture, financial dashboard UI, typed data modeling, strategy configuration workflows, a simulated quant research service layer, risk and benchmark visualization, and product thinking for fintech tools.
