import { execAsync } from '@/libraries/Functions/execAsync';

export async function getDiskUsage(): Promise<number> {
    try {
        const { stdout } = await execAsync(
            "df -h / | tail -1 | awk '{print $5}'",
        );

        return parseInt(stdout.trim().replace('%', ''), 10);
    } catch (error) {
        console.error('ディスク使用率の取得に失敗しました:', error);
        return 0;
    }
}
