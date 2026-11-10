export interface Snapshot { cpuPercent: number | null; memoryUsed: number; memoryTotal: number; sampledAt: number; platform: string }
export interface NexusAPI { snapshot(): Promise<Snapshot> }
