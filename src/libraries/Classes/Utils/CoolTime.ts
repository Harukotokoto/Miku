export class CoolTime {
    private static coolTimeData: { userId: string; lastUsed: Date }[] = [];
    private readonly userId: string;

    /**
     * ユーザーIDを指定して新しいインスタンスを生成します。
     *
     * @param {string} userId ユーザーを一意に識別するID
     * @return {void}
     */
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
    public setCoolTime(): void {
        const now = new Date();
        const existingEntry = CoolTime.coolTimeData.find(
            (entry) => entry.userId === this.userId,
        );
        if (existingEntry) {
            existingEntry.lastUsed = now;
        } else {
            CoolTime.coolTimeData.push({ userId: this.userId, lastUsed: now });
        }
    }

    /**
     * クールタイムが経過しているかを確認します。
     *
     * @param {number} time クールタイムの閾値をミリ秒単位で指定します。
     * @return {boolean} クールタイム中であればtrueを返し、そうでなければfalseを返します。
     */
    public getCoolTime(time: number): boolean {
        const now = new Date();
        const entry = CoolTime.coolTimeData.find(
            (entry) => entry.userId === this.userId,
        );
        if (entry) {
            const elapsed = now.getTime() - entry.lastUsed.getTime();
            return elapsed < time;
        }
        return false;
    }

    /**
     * 指定された時間を基準に次に利用可能な時間を取得します。
     *
     * @param {number} time 基準となるミリ秒の時間。
     * @return {number | null} 利用可能な時間が秒単位で返されます。該当するデータがない場合はnullを返します。
     */
    public getNextAvailableTime(time: number): number | null {
        const entry = CoolTime.coolTimeData.find(
            (entry) => entry.userId === this.userId,
        );
        if (entry) {
            return Math.floor(
                new Date(entry.lastUsed.getTime() + time).getTime() / 1000,
            );
        }
        return null;
    }
}
