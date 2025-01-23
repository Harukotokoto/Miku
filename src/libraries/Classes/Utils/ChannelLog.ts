import { Colors } from 'discord.js';
import { SendErrorOptions } from '@/interfaces/SendErrorOptions';
import { getOsName } from '@/libraries/Functions/System/getOsName';
import { getCpuUsage } from '@/libraries/Functions/System/getCpuUsage';
import { getRamUsage } from '@/libraries/Functions/System/getRamUsage';
import { getDiskUsage } from '@/libraries/Functions/System/getDiskUsage';
import { client } from '@/index';
import { MikuWebhookClient } from '@/libraries/Classes/Utils/MikuWebhookClient';

export class ChannelLog {
    private webhook: MikuWebhookClient;

    /**
     * 指定されたWebhook URLを使用して、新しいMikuWebhookClientインスタンスを初期化します。
     *
     * @param {string} webhookUrl 使用されるWebhookのURL
     * @return {void}
     */
    constructor(webhookUrl: string) {
        this.webhook = new MikuWebhookClient({
            url: webhookUrl,
        });
    }

    /**
     * サーバーの各種リソース情報（CPU使用率、RAM使用率、ディスク使用率、OS名）を収集し、
     * それを指定されたWebhookを通じて送信します。
     *
     * @return {Promise<void>} このメソッドは非同期に動作し、すべての送信処理が完了した後に解決されます。
     */
    public async sendUpLog() {
        const cpuRatio = await getCpuUsage();
        const ramRatio = getRamUsage();
        const diskRatio = await getDiskUsage();
        const osName = getOsName();

        await this.webhook.send({
            embeds: [
                {
                    title: `${client.user?.tag}が起動しました！`,
                    fields: [
                        {
                            name: 'CPU使用率',
                            value: `${cpuRatio}%`,
                            inline: true,
                        },
                        {
                            name: 'RAM使用率',
                            value: `${ramRatio}%`,
                            inline: true,
                        },
                        {
                            name: 'ディスク使用率',
                            value: `${diskRatio}%`,
                            inline: true,
                        },
                        { name: 'OS', value: osName, inline: false },
                    ],
                    thumbnail: {
                        url: client.user?.displayAvatarURL() || '',
                    },
                    color: Colors.Blue,
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }

    /**
     * 指定されたオプションを使用してエラーログを送信します。
     *
     * @param {SendErrorOptions} options - エラーログ送信に使用するオプション。`message` プロパティは送信されるエラーメッセージです。
     * @return {Promise<void>} エラーログ送信が完了した後に解決される Promise を返します。
     */
    public async sendErrorLog(options: SendErrorOptions) {
        const message = options.message || '不明なエラー';
        await this.webhook.send({
            embeds: [
                {
                    title: 'エラーが発生しました',
                    description: `\`\`\`\n${message}\n\`\`\``,
                    color: Colors.Red,
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }
}
