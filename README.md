# SignalForge

An interactive equity-strategy research dashboard built as a **personal software prototype** by SeungWoo Noh.

[Live prototype](https://signalforge-beryl.vercel.app)

**All results use simulated data.** This is a frontend prototype for exploring research workflows, not a validated backtesting engine. It does not provide investment advice or evidence of strategy performance.

## What it does

- Configure rule-based strategies and save strategy presets.
- Explore a mock stock screener and simulated backtest results.
- Compare simulated runs, inspect sensitivity scenarios, and view rebalance logs.
- Review benchmark charts, risk metrics, and research-note screens.
- Switch between light and dark themes.

## My work

I implemented the frontend, typed mock-service interfaces, strategy state, run history/comparison flows, and responsive layouts. The [commit history](https://github.com/Seungwoo0120/signalforge/commits/main/?author=Seungwoo0120) records these changes.

## Stack and structure

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Recharts

| Path | Responsibility |
| --- | --- |
| `src/app/` | Routes and application shell |
| `src/components/` | Dashboard, strategy builder, screener, results, and notes UI |
| `src/services/mock-*-service.ts` | Typed simulated data and calculations |
| `src/lib/quant-metrics.ts` | Metric calculation helpers for the prototype |
| `src/hooks/` | Browser-local run history and strategy presets |
| `src/types/` | Strategy and result contracts |

The service boundary separates UI code from mock calculations so a future backend can replace them. That backend is not implemented.

## Development

Use Node.js and npm with versions compatible with the Next.js 15 dependencies in `package.json`.

```bash
git clone https://github.com/Seungwoo0120/signalforge.git
cd signalforge
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

Available checks and production commands, as defined in `package.json`:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

These commands are documented from the repository configuration; they were not rerun as part of the profile/documentation update. No automated test suite or CI workflow is currently included in this repository.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Dashboard |
| `/strategy-builder` | Strategy configuration |
| `/backtest` | Simulated results |
| `/screener` | Mock stock screening |
| `/research-notes` | Research notes |

## Limitations

- Market series, screening data, and backtest outputs are simulated; the displayed ticker names do not make the results historical market evidence.
- No real market-data API, brokerage integration, or order execution.
- No live AI/OpenAI calls; explanatory content is part of the prototype.
- No authentication, backend quant engine, or persistent server database.
- Run history and presets use browser-local storage rather than shared user accounts.
- Financial metrics and simulation assumptions have not been independently validated for investment use.

## Next development step

Replace a typed mock service with a tested backend using real historical data, then validate calculations and assumptions before presenting results as backtests.
