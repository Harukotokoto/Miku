import { ClientEvents } from 'discord.js';

export class Event<Key extends keyof ClientEvents> {
    /**
     * 指定されたイベントキーとコールバック関数を使用して、新しいインスタンスを初期化します。
     *
     * @param {Key} event イベントのキーを指定します。
     * @param {function} run イベント発生時に実行されるコールバック関数を指定します。
     */
    constructor(
        public event: Key,
        public run: (...args: ClientEvents[Key]) => void,
    ) {}
}
