import { PlatformScore } from './scorer';

export interface AlertRecord {
  platform: PlatformScore['platform'];
  interpretation: PlatformScore['interpretation'];
  score: number;
  triggeredAt: number;
  note: string;
}

export class AlertController {
  private history: AlertRecord[] = [];

  issue(scores: PlatformScore[]): AlertRecord | null {
    const urgent = scores.find((score) => score.interpretation === 'urgent');
    if (!urgent) {
      return null;
    }

    const record: AlertRecord = {
      platform: urgent.platform,
      interpretation: urgent.interpretation,
      score: urgent.compositeScore,
      triggeredAt: Date.now(),
      note: `Detected urgent signal with ${urgent.samples} samples.`,
    };

    this.history.push(record);
    return record;
  }

  latest(): AlertRecord | null {
    if (!this.history.length) {
      return null;
    }
    return this.history[this.history.length - 1];
  }

  all(): AlertRecord[] {
    return [...this.history];
  }
}
