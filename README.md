# SignalForge

A modern quantitative strategy research and backtesting web application.

SignalForge helps users structure rule-based equity strategy ideas, review simulated backtest results, compare benchmark context, and inspect risk metrics through a modern web dashboard.

The current version uses simulated prototype data and client-side state only. It is designed with a service boundary that can later be replaced by real market data providers, persistent storage, and backend backtesting engines. SignalForge is not financial advice, a trading recommendation, or a prediction of future performance.

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

- Uses simulated prototype data only.
- No real market data API calls.
- No real AI/OpenAI calls.
- No authentication or user accounts.
- No backend quant engine or persistent database.

## Recommended Next Step

Strengthen the simulated backtest service boundary so a typed backend quant engine can replace the prototype implementation later without rewriting the UI.
