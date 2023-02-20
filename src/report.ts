import { PlatformScore } from './scorer';

export function formatSignal(score: PlatformScore): string {
  const emphasis =
    score.interpretation === 'urgent'
      ? '‼'
      : score.interpretation === 'watch'
      ? '⚠'
      : '·';
  return `${emphasis} ${score.platform} – ${score.interpretation.toUpperCase()} (score ${score.compositeScore})`;
}

export function buildSummary(scores: PlatformScore[]): string[] {
  const lines = scores.map((score) => formatSignal(score));
  if (!lines.length) {
    lines.push('No signals yet – collect more snapshots to activate the scorer.');
  }
  return lines;
}

export function highlightUrgent(scores: PlatformScore[]): PlatformScore | null {
  return scores.find((score) => score.interpretation === 'urgent') ?? null;
}
