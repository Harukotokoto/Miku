import { Channel, Collection, Message } from 'discord.js';
import { client } from '@/index';
import { RegisterMessageOptions } from '@/interfaces/RegisterMessageOptions';

export class Snipe {
    private channel: Channel;
    private snipes: Collection<string, Message>;
    private editSnipes: Collection<
        string,
        { oldMessage: Message; newMessage: Message }
    >;

    constructor(channel: Channel) {
        this.channel = channel;
        this.snipes = client.snipes;
        this.editSnipes = client.edit_snipes;
    }

    /**
     * 指定タイプのメッセージを取得
     * @param type 'edit' | 'delete'
     * @returns メッセージデータ
     */
    getMessage(type: 'edit' | 'delete') {
        if (type === 'delete') {
            const snipedMessage = this.snipes.get(this.channel.id);
            if (!snipedMessage) {
                return null;
            }

            return {
                message: snipedMessage,
            };
        } else if (type === 'edit') {
            const editSnipe = this.editSnipes.get(this.channel.id);
            if (!editSnipe) {
                return null;
            }
            return {
                message: editSnipe.oldMessage,
                newMessage: editSnipe.newMessage,
            };
        } else {
            throw new Error('不正なメッセージタイプです。');
        }
    }

    /**
     * 指定タイプのメッセージをセット
     * @param options {RegisterMessageOptions} メッセージを登録するオプション
     */
    setMessage(options: RegisterMessageOptions) {
        if (options.type === 'delete') {
            this.snipes.set(this.channel.id, options.message);
        } else if (options.type === 'edit') {
            if (!options.newMessage) {
                throw new Error(
                    '編集されたメッセージを保存する場合は新しいメッセージが必要です。',
                );
            }
            this.editSnipes.set(this.channel.id, {
                oldMessage: options.message,
                newMessage: options.newMessage,
            });
        } else {
            throw new Error('不正なメッセージタイプです。');
        }
    }
}
