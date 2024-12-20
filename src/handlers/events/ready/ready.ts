import { Event } from '@/libraries/Classes/Handlers/Event';
import { client } from '@/index';
import { ActivityType } from 'discord.js';

export default new Event('ready', async () => {
  if (!client.user) {
    return client.logger.error('クライアントユーザーが見つかりませんでした。');
  }

  client.logger.info(client.user.tag + 'でログインしました');
  client.logger.info('Prefix: ' + client.prefix);

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
  }
});
