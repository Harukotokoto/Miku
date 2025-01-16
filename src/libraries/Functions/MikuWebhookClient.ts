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
    constructor(data: WebhookClientData, options?: WebhookClientOptions) {
        super(data, options);
    }

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
