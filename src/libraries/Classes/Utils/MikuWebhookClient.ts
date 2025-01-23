import {
    APIMessage,
    MessagePayload,
    WebhookClient,
    WebhookClientData,
    WebhookClientOptions,
    WebhookMessageCreateOptions,
} from 'discord.js';
import { client } from '@/index';

export class MikuWebhookClient extends WebhookClient {
    /**
     * WebhookClientのコンストラクタ。
     *
     * @param {WebhookClientData} data Webhookクライアントの基本情報を含むデータ。
     * @param {WebhookClientOptions} [options] オプション設定を含むデータ。
     * @return {void} このコンストラクタは新しいWebhookClientインスタンスを初期化します。
     */
    constructor(data: WebhookClientData, options?: WebhookClientOptions) {
        super(data, options);
    }

    /**
     * メッセージを送信するメソッド。
     *
     * @param {string|MessagePayload|WebhookMessageCreateOptions} options メッセージの内容またはメッセージ作成オプション。
     *                               - string: メッセージのテキスト内容。
     *                               - MessagePayload: メッセージペイロード。
     *                               - WebhookMessageCreateOptions: Webhookでのメッセージ設定オプション。
     * @return {Promise<APIMessage>} 送信されたメッセージの情報を含むPromise。
     */
    override async send(
        options: string | MessagePayload | WebhookMessageCreateOptions,
    ): Promise<APIMessage> {
        if (typeof options === 'string') {
            options = { content: options } as WebhookMessageCreateOptions;
        }

        const updatedOptions = {
            ...(options as WebhookMessageCreateOptions),
            username: client.user?.username,
            avatarURL: client.user?.displayAvatarURL(),
        };

        return await super.send(updatedOptions);
    }
}
