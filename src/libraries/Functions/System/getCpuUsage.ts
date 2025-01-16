import * as os from 'node:os';

export async function getCpuUsage(): Promise<number> {
    const cpus = os.cpus();
    const totalTimes = cpus.map((cpu) =>
        Object.values(cpu.times).reduce((acc, time) => acc + time, 0),
    );
    const idleTimes = cpus.map((cpu) => cpu.times.idle);

    await new Promise((resolve) => setTimeout(resolve, 100));
    const newCpus = os.cpus();
    const newTotalTimes = newCpus.map((cpu) =>
        Object.values(cpu.times).reduce((acc, time) => acc + time, 0),
    );
    const newIdleTimes = newCpus.map((cpu) => cpu.times.idle);

    const usagePercents = cpus.map((_, i) => {
        const totalDiff = newTotalTimes[i] - totalTimes[i];
        const idleDiff = newIdleTimes[i] - idleTimes[i];
        return 100 - Math.round((idleDiff / totalDiff) * 100);
    });

    return (
        usagePercents.reduce((acc, percent) => acc + percent, 0) /
        usagePercents.length
    ); // 平均値
}
