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

    constructor(webhookUrl: string) {
        this.webhook = new MikuWebhookClient({
            url: webhookUrl,
        });
    }

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
