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
