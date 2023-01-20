import { Collector } from './collector';
import { ScoreEngine } from './scorer';

const collector = new Collector({ maxHistory: 64 });
const scorer = new ScoreEngine({ lookback: 32, minSamples: 2 });

export function runSurvey() {
  const snapshots = collector.collect();
  const report = scorer.assess(collector.exportHistory());

  console.group('LiminalLedger Snapshot');
  console.log(`collected ${snapshots.length} estimates across ${collector.exportHistory().length} stored records`);
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
  } else {
    console.log('Not enough history to compute a signal yet.');
  }
  console.groupEnd();

  return { snapshots, report };
}

if (typeof require !== 'undefined' && require.main === module) {
  runSurvey();
}
