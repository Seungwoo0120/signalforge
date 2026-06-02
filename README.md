# SignalForge

A modern quantitative strategy research and backtesting web application.

SignalForge is currently a frontend prototype built with Next.js, TypeScript, Tailwind CSS, and mock strategy/backtest data. It does not connect to market data APIs, AI services, authentication, databases, or a real backtesting engine yet.

## Development

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

The production build now runs Next.js compilation plus its built-in lint and TypeScript validation. `npm run typecheck` is also available as an explicit standalone TypeScript check.

## Current Routes

- `/`
- `/strategy-builder`
- `/backtest`
- `/screener`
- `/research-notes`

## Current Limitations

- Uses local mock data only.
- No real market data API calls.
- No real AI/OpenAI calls.
- No authentication or user accounts.
- No backend quant engine or persistent database.

## Recommended Next Step

Add a small mock backtest service boundary, such as a typed function or local module that accepts the strategy configuration and returns mock results. That will make it easier to replace the mock implementation with a real backend later without rewriting the UI.
