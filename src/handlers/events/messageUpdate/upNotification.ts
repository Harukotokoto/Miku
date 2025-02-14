import { Event } from '@/handlers/Event';
import { Colors } from 'discord.js';
import { client } from '@/index';
import { ModuleConfig } from '@/modules/ModuleConfig';
import ms from 'ms';
import { CoolTime } from '@/libraries/Classes/Utils/CoolTime';

export default new Event('messageUpdate', async (_, message) => {
    if (!message.guild) return;
    const module = new ModuleConfig(message.guild, 'bump_notification');
    if (!(await module.isEnabled())) return;

    if (message.author.id === '761562078095867916') {
        if (
            message.embeds[0]?.fields[0]?.name.match(/をアップしたよ/) ||
            message.embeds[0]?.fields[0]?.name.match(/I've bumped up/)
        ) {
            const ct = new CoolTime(message.author.id);
            if (ct.getCoolTime('up_notification', ms('59m'))) return;

            ct.setCoolTime('up_notification');

            await message.channel.send({
                embeds: [
                    {
                        title: 'Upしてくれてありがとね！',
                        description:
                            '1時間後にお知らせするね！\n' +
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
                            title: 'Upの時間です！',
                            description:
                                '</dissoku up:828002256690610256>で表示順位を上げよう！\n',
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }, ms('1h'));
        }
    }
});
