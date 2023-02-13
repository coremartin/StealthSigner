import { Snapshot } from '../src/collector';
import { ScoreEngine } from '../src/scorer';

const snapshots: Snapshot[] = [
  { provider: 'CloudRPC', platform: 'ethereum', baseFee: 40, priorityFee: 3, timestamp: 1 },
  { provider: 'CloudRPC', platform: 'ethereum', baseFee: 42, priorityFee: 4, timestamp: 2 },
  { provider: 'EdgeLink', platform: 'polygon', baseFee: 20, priorityFee: 1, timestamp: 3 },
  { provider: 'EdgeLink', platform: 'polygon', baseFee: 22, priorityFee: 1.5, timestamp: 4 },
  { provider: 'NightShift', platform: 'optimism', baseFee: 15, priorityFee: 0.5, timestamp: 5 },
  { provider: 'NightShift', platform: 'optimism', baseFee: 17, priorityFee: 0.8, timestamp: 6 },
];

const engine = new ScoreEngine({ lookback: 12, minSamples: 2 });
const results = engine.assess(snapshots);

if (results.length !== 3) {
  throw new Error(`Expected 3 platforms in the score, got ${results.length}`);
}

const highest = results[0];
if (highest.compositeScore <= 0) {
  throw new Error('Composite score should be positive for the most volatile platform');
}

console.log('ScoreEngine smoke test passed');
