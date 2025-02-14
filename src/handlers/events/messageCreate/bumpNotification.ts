import { Event } from '@/handlers/Event';
import { Colors } from 'discord.js';
import { client } from '@/index';
import ms from 'ms';
import { ModuleConfig } from '@/modules/ModuleConfig';

export default new Event('messageCreate', async (message) => {
    if (!message.guild) return;
    const module = new ModuleConfig(message.guild, 'bump_notification');
    if (!(await module.isEnabled())) return;

    if (message.author.id === '302050872383242240') {
        if (
            message.embeds[0]?.description?.match(/表示順をアップしたよ/) ||
            message.embeds[0]?.description?.match(/Bump done/)
        ) {
            await message.channel.send({
                embeds: [
                    {
                        title: 'Bumpしてくれてありがとね！',
                        description:
                            '2時間後にお知らせするね！\n' +
                            '-# `/module disable`コマンドを使用して通知を切ることができます。',
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
            });

            setTimeout(async () => {
                await message.channel.send({
                    embeds: [
                        {
                            title: 'Bumpの時間です！',
                            description:
                                '</bump:947088344167366698>で表示順位を上げよう！\n',
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }, ms('2h'));
        }
    }
});
