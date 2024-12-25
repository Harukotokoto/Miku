export class CoolTime {
  private static coolTimeData: { userId: string; lastUsed: Date }[] = [];
  private readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

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
