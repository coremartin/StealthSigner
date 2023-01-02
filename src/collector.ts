export type Platform = 'ethereum' | 'polygon' | 'optimism';

export interface ProviderConfig {
  name: string;
  platform: Platform;
  endpoint: string;
  weight: number;
}

export interface Snapshot {
  provider: string;
  platform: Platform;
  baseFee: number;
  priorityFee: number;
  timestamp: number;
}

export interface CollectorOptions {
  providers: ProviderConfig[];
  maxHistory?: number;
}

const defaultProviders: ProviderConfig[] = [
  { name: 'CloudRPC', platform: 'ethereum', endpoint: 'https://cloud.rpc/eth', weight: 0.5 },
  { name: 'EdgeLink', platform: 'polygon', endpoint: 'https://edge.link/polygon', weight: 0.3 },
  { name: 'NightShift', platform: 'optimism', endpoint: 'https://night.optimism', weight: 0.2 },
];

function fakeEstimate(provider: ProviderConfig): Snapshot {
  const base = 15 + Math.random() * 30;
  const priority = Math.random() * 20;
  return {
    provider: provider.name,
    platform: provider.platform,
    baseFee: parseFloat(base.toFixed(2)),
    priorityFee: parseFloat(priority.toFixed(2)),
    timestamp: Date.now(),
  };
}

export class Collector {
  private history: Snapshot[] = [];
  constructor(private options: CollectorOptions = { providers: defaultProviders }) {}

  collect(): Snapshot[] {
    const providers = this.options.providers.length ? this.options.providers : defaultProviders;
    const batch = providers.map((provider) => fakeEstimate(provider));
    this.history.push(...batch);
    if (this.options.maxHistory && this.history.length > this.options.maxHistory) {
      this.history = this.history.slice(-this.options.maxHistory);
    }
    return batch;
  }

  latest(): Snapshot | null {
    if (!this.history.length) {
      return null;
    }
    return this.history[this.history.length - 1];
  }

  exportHistory(): Snapshot[] {
    return [...this.history];
  }
}
