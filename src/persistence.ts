import { promises as fsp } from 'fs';
import path from 'path';
import { Snapshot } from './collector';

export class SnapshotStore {
  constructor(private filePath = path.join(process.cwd(), 'state', 'snapshot-history.json')) {}

  async read(): Promise<Snapshot[]> {
    try {
      const raw = await fsp.readFile(this.filePath, 'utf-8');
      return JSON.parse(raw) as Snapshot[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async persist(entries: Snapshot[]): Promise<Snapshot[]> {
    await this.ensureDir();
    const existing = await this.read();
    const merged = [...existing, ...entries].slice(-200);
    await fsp.writeFile(this.filePath, JSON.stringify(merged, null, 2));
    return merged;
  }

  private async ensureDir() {
    const dir = path.dirname(this.filePath);
    await fsp.mkdir(dir, { recursive: true });
  }
}
