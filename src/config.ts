import { ProviderConfig } from './collector';

export const providerSets: Record<string, ProviderConfig[]> = {
  default: [
    { name: 'CloudRPC', platform: 'ethereum', endpoint: 'https://cloud.rpc/eth', weight: 0.5 },
    { name: 'EdgeLink', platform: 'polygon', endpoint: 'https://edge.link/polygon', weight: 0.3 },
    { name: 'NightShift', platform: 'optimism', endpoint: 'https://night.optimism', weight: 0.2 },
  ],
  diligence: [
    { name: 'StreamBeacon', platform: 'ethereum', endpoint: 'https://streambeacon.com/eth', weight: 0.6 },
    { name: 'Backbeat', platform: 'polygon', endpoint: 'https://backbeat.local/polygon', weight: 0.25 },
    { name: 'Aurora', platform: 'optimism', endpoint: 'https://aurora.rpc/optimism', weight: 0.15 },
  ],
  alerting: [
    { name: 'DeltaWatch', platform: 'ethereum', endpoint: 'https://delta.watch/eth', weight: 0.35 },
    { name: 'FluxLens', platform: 'polygon', endpoint: 'https://fluxlens/api', weight: 0.4 },
    { name: 'Pulse', platform: 'optimism', endpoint: 'https://pulse.rpc', weight: 0.25 },
  ],
};

export function resolveProviderSet(name: string): ProviderConfig[] {
  return providerSets[name] ?? providerSets.default;
}
