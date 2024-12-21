import { Command } from '@/libraries/Classes/Handlers/Command';
import {
  ApplicationIntegrationType,
  Colors,
  InteractionContextType,
} from 'discord.js';

export default new Command({
  name: 'ping',
  description: 'BotにPingを送信します',
  contexts: [
    InteractionContextType.PrivateChannel,
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
  ],
  integrationTypes: [
    ApplicationIntegrationType.UserInstall,
    ApplicationIntegrationType.GuildInstall,
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const ping = client.ws.ping;

      await interaction.followUp({
        embeds: [
          {
            title: '🏓 Pong!',
            description:
              'Botは正常に起動しています！\n' +
              '\n' +
              `**Ping:** ${ping}ms\n` +
              `**Prefix:** ${client.prefix}`,
            color: Colors.Green,
            footer: client.footer(),
          },
        ],
      });
    },
    message: async ({ client, message, args }) => {
      const ping = client.ws.ping;

      await message.reply({
        embeds: [
          {
            title: '🏓 Pong!',
            description:
              'Botは正常に起動しています！\n' +
              '\n' +
              `**Ping:** ${ping}ms\n` +
              `**Prefix:** ${client.prefix}`,
            color: Colors.Green,
            footer: client.footer(),
          },
        ],
      });
    },
  },
});
