import { Event } from '@/libraries/Classes/Handlers/Event';
import { client } from '@/index';
import { ActivitiesOptions, ActivityType } from 'discord.js';

export default new Event('ready', async () => {
    if (!client.user) {
        return client.logger.error(
            'クライアントユーザーが見つかりませんでした。',
        );
    }

    client.logger.info(client.user.tag + 'でログインしました');
    client.logger.info('Prefix: ' + client.prefix);

    await client.systemLog.sendUpLog();

    if (client.debugMode) {
        client.logger.debug('デバッグモードは有効です');

        client.user.setPresence({
            activities: [
                {
                    name: '開発モードが有効です',
                    type: ActivityType.Listening,
                },
            ],
            status: 'dnd',
        });
    } else {
        const presences: ActivitiesOptions[] = [
            {
                name: '{guildCount}サーバー',
                type: ActivityType.Competing,
            },
            {
                name: '/help | {ping}ms',
                type: ActivityType.Playing,
            },
        ];

        let index = 0;

        setInterval(() => {
            client.user?.setActivity(
                presences[index].name
                    .replace(
                        '{guildCount}',
                        client.guilds.cache.size.toString(),
                    )
                    .replace('{ping}', client.ws.ping.toString()),
            );

            if (index === presences.length - 1) {
                index = 0;
            } else {
                index++;
            }
        }, 7.5 * 1_000);
    }
});
