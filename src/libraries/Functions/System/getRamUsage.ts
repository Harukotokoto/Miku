import * as os from 'node:os';

export function getRamUsage(): number {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    return Math.round((usedMemory / totalMemory) * 100);
}
