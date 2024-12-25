"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolTime = void 0;
class CoolTime {
    constructor(userId) {
        this.userId = userId;
    }
    setCoolTime() {
        const now = new Date();
        const existingEntry = CoolTime.coolTimeData.find((entry) => entry.userId === this.userId);
        if (existingEntry) {
            existingEntry.lastUsed = now;
        }
        else {
            CoolTime.coolTimeData.push({ userId: this.userId, lastUsed: now });
        }
    }
    getCoolTime(time) {
        const now = new Date();
        const entry = CoolTime.coolTimeData.find((entry) => entry.userId === this.userId);
        if (entry) {
            const elapsed = now.getTime() - entry.lastUsed.getTime();
            return elapsed < time;
        }
        return false;
    }
    getNextAvailableTime(time) {
        const entry = CoolTime.coolTimeData.find((entry) => entry.userId === this.userId);
        if (entry) {
            return entry.lastUsed.getTime() + time;
        }
        return null;
    }
}
exports.CoolTime = CoolTime;
CoolTime.coolTimeData = [];
