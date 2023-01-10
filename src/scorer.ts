import { Platform, Snapshot } from './collector';

export interface PlatformScore {
  platform: Platform;
  samples: number;
  baseAverage: number;
  priorityAverage: number;
  baseVolatility: number;
  priorityVolatility: number;
  compositeScore: number;
  interpretation: 'calm' | 'watch' | 'urgent';
}

export interface ScoreOptions {
  lookback?: number;
  minSamples?: number;
}

const interpretationThresholds = {
  urgent: 65,
  watch: 35,
};

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stddev(values: number[]): number {
  if (!values.length) return 0;
  const center = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - center) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export class ScoreEngine {
  constructor(private options: ScoreOptions = {}) {}

  assess(history: Snapshot[]): PlatformScore[] {
    const lookback = this.options.lookback ?? 24;
    const minSamples = this.options.minSamples ?? 3;
    const slice = history.slice(-lookback);
    const buckets = new Map<Platform, Snapshot[]>();

    for (const snapshot of slice) {
      if (!buckets.has(snapshot.platform)) {
        buckets.set(snapshot.platform, []);
      }
      buckets.get(snapshot.platform)!.push(snapshot);
    }

    const scores: PlatformScore[] = [];

    for (const [platform, snapshots] of buckets) {
      if (snapshots.length < minSamples) {
        continue;
      }

      const baseValues = snapshots.map((snap) => snap.baseFee);
      const priorityValues = snapshots.map((snap) => snap.priorityFee);

      const baseAverage = mean(baseValues);
      const priorityAverage = mean(priorityValues);
      const baseVolatility = stddev(baseValues) / (baseAverage + 1);
      const priorityVolatility = stddev(priorityValues) / (priorityAverage + 1);

      const composite = Math.min(100, Math.max(0, (baseVolatility * 0.6 + priorityVolatility * 0.4) * 120));

      scores.push({
        platform,
        samples: snapshots.length,
        baseAverage: parseFloat(baseAverage.toFixed(2)),
        priorityAverage: parseFloat(priorityAverage.toFixed(2)),
        baseVolatility: parseFloat(baseVolatility.toFixed(3)),
        priorityVolatility: parseFloat(priorityVolatility.toFixed(3)),
        compositeScore: parseFloat(composite.toFixed(1)),
        interpretation: this.interpret(composite),
      });
    }

    return scores.sort((a, b) => b.compositeScore - a.compositeScore);
  }

  private interpret(score: number): PlatformScore['interpretation'] {
    if (score >= interpretationThresholds.urgent) {
      return 'urgent';
    }
    if (score >= interpretationThresholds.watch) {
      return 'watch';
    }
    return 'calm';
  }
}
