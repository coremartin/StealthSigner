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
