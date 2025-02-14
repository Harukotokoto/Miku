export class CoolTime {
    private static coolTimeData: {
        userId: string;
        lastUsed: Date;
        id: string;
    }[] = [];
    private readonly userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    /**
     * クールタイムを設定します。このメソッドは現在の日時を取得し、
     * 指定されたユーザーIDに関連付けて、既存のエントリがある場合は
     * 更新を行い、存在しない場合は新たにエントリを追加します。
     *
     * @return {void} 何も返しません。
     */
    public setCoolTime(id: string): void {
        const now = new Date();
        const existingEntry = CoolTime.coolTimeData.find(
            (entry) => entry.userId === this.userId,
        );
        if (existingEntry) {
            existingEntry.lastUsed = now;
        } else {
            CoolTime.coolTimeData.push({
                userId: this.userId,
                lastUsed: now,
                id,
            });
        }
    }

    /**
     * 指定されたIDと時間を基に、クールタイム中かどうかを判定します。
     * @param {string} id 判定対象のID。
     * @param {number} time クールタイムの基準時間（ミリ秒単位）。
     * @return {boolean} クールタイム中であればtrue、そうでなければfalseを返します。
     */
    public getCoolTime(id: string, time: number): boolean {
        const now = new Date();
        const entry = CoolTime.coolTimeData.find(
            (entry) => entry.userId === this.userId && entry.id === id,
        );
        if (entry) {
            const elapsed = now.getTime() - entry.lastUsed.getTime();
            return elapsed < time;
        }
        return false;
    }

    /**
     * 指定されたIDと時間を基に、次に使用可能な時間を取得します。
     *
     * @param {string} id ユーザーが問い合わせる対象のID。
     * @param {number} time 指定されたクールダウン時間（ミリ秒単位）。
     * @return {number | null} 次に使用可能な時間のタイムスタンプ（秒単位）を返します。該当するエントリが存在しない場合はnullを返します。
     */
    public getNextAvailableTime(id: string, time: number): number | null {
        const entry = CoolTime.coolTimeData.find(
            (entry) => entry.userId === this.userId && entry.id === id,
        );
        if (entry) {
            return Math.floor(
                new Date(entry.lastUsed.getTime() + time).getTime() / 1000,
            );
        }
        return null;
    }
}
