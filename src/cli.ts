import { Collector } from './collector';
import { ScoreEngine } from './scorer';
import { SnapshotStore } from './persistence';
import { resolveProviderSet } from './config';
import { buildSummary, highlightUrgent } from './report';

const providerSet = resolveProviderSet(process.env.LIMINAL_PROVIDER_SET ?? 'default');
const collector = new Collector({ maxHistory: 64, providers: providerSet });
const scorer = new ScoreEngine({ lookback: 32, minSamples: 2 });
const store = new SnapshotStore();

export async function runSurvey() {
  const snapshots = collector.collect();
  const history = await store.persist(snapshots);
  const report = scorer.assess(history);

  console.group('LiminalLedger Snapshot');
  console.log(`using provider set: ${providerSet.map((provider) => provider.name).join(', ')}`);
  console.log(`collected ${snapshots.length} estimates across ${history.length} stored records`);
  console.table(
    snapshots.map((snapshot) => ({
      provider: snapshot.provider,
      platform: snapshot.platform,
      baseFee: snapshot.baseFee,
      priorityFee: snapshot.priorityFee,
    }))
  );

  if (report.length) {
    const [top] = report;
    console.log(`Top signal: ${top.platform} is ${top.interpretation} (score ${top.compositeScore})`);
    console.table(report);
    buildSummary(report).forEach((line) => console.log(line));
    const urgent = highlightUrgent(report);
    if (urgent) {
      console.log(`Urgent attention: ${urgent.platform} with score ${urgent.compositeScore}`);
    }
  } else {
    console.log('Not enough history to compute a signal yet.');
  }
  console.groupEnd();

  return { snapshots, report };
}

if (typeof require !== 'undefined' && require.main === module) {
  void runSurvey();
}
