# LiminalLedger

LiminalLedger is a solo effort that tracks on-chain fee anomalies and recommends tentative time windows for deploying high-sensitivity transactions. The project mixes web2 tooling (data aggregation) with lightweight web3 insights so a single developer can move fast without complex infrastructure.

## Goals

- Capture the best-fee snapshots from multiple RPC endpoints.
- Score the variance between the "usual" and "urgent" states to generate actionable insight.
- Present the findings through a minimal CLI that can be extended into a dashboard later.

## Project Flow

1. Fetch clustered gas estimates from different chains and providers.
2. Normalize each feed with a common volatility index.
3. Rank the short-term opportunity windows with a confidence score.
4. Log the results and provide hooks for alerting or automation.

## Current focus

Right now the codebase is focused on the collector/adapter layer. Future work will expand into alert delivery and history playback.

The latest layer adds a volatility scoring engine so the collector batches can be ranked. A `ScoreEngine` ingests the recent history, computes platform-specific base/priority volatility, and emits a confidence score along with a calm/watch/urgent interpretation. That output will feed the next CLI hook so the solo maintainer can decide when to push sensitive transactions without needing a full analytics stack.

## CLI runner

`src/cli.ts` ties together the collector and scoring engine into a lightweight runner. Each invocation gathers the freshest fake RPC estimates, stores them in a sliding history, and prints a table of the latest values plus a ranked list of platform signals. Keeping the runner minimal lets the same loop be wired into cron jobs, CLI dashboards, or alert hooks later without rewriting the core logic.

## Scripts

`package.json` ships with `survey` and `test` scripts so the solo developer can kickstart the CLI or the scorer test without remembering long commands. Running `npm run survey` executes the collector loop via `ts-node`, and `npm run test` exercises the smoke script that guards the scoring math.

## Reporting helpers

`src/report.ts` keeps the formatting logic separate so the CLI can print badges and short-form summaries for every signal. The helpers also expose a `highlightUrgent` convenience function that the runner uses to flag any `urgent` platforms, mirroring how a future alerting service would prioritize a single feed.

## Alert stub

`src/alert.ts` is a placeholder controller that records the latest urgent signal and stamps it with a friendly note. The CLI can hook into this later to push notifications through a webhook, email, or bot channel without touching the scoring math again.

## Persistence stub

`src/persistence.ts` keeps a local `state/snapshot-history.json` file with the last 200 entries so the CLI can capture multi-run context. The `SnapshotStore` exposes `read` and `persist` helpers that append the newest estimates, trim the file, and then hand the merged history back to the scorer. This emulates a simple persistence layer until a proper database or event log is introduced.

## Provider sets

Provider sets live in `src/config.ts` so the collector can swap between default, diligence, or alerting feeds. The CLI respects the `LIMINAL_PROVIDER_SET` environment variable and prints the active set on every run, which keeps the solo maintainer aware of where the estimates are sourced when reviewing logs or alerts.

## Testing notes

There is a simple smoke script at `tests/scorer.test.ts` that pumps fake snapshots into `ScoreEngine` and asserts the expected platforms and scoring behavior. You can run it with a TypeScript runner (e.g. `npx ts-node tests/scorer.test.ts`) or compile the tests to JavaScript if a bundler is added later.
