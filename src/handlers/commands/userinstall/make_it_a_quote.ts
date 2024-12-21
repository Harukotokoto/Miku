import { Command } from '@/handlers/Command';
import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
} from 'discord.js';
import { MakeItAQuote } from '@/libraries/Classes/Modules/MakeItAQuote';

export default new Command({
  name: 'Make it a Quote',
  type: ApplicationCommandType.Message,
  contexts: [
    InteractionContextType.PrivateChannel,
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
  ],
  integrationTypes: [ApplicationIntegrationType.UserInstall],
  execute: {
    interaction: async ({ client, interaction }) => {
      const message = interaction.targetMessage;

      const miq = new MakeItAQuote()
        .setText(message.cleanContent)
        .setUsername(message.author.tag)
        .setDisplayName(message.author.displayName)
        .setAvatarURL(message.author.displayAvatarURL({ size: 1024 }))
        .setWatermark(client.user?.tag || '');

      const quote = await miq.build();

      await interaction.followUp({
        content: `[生成元のメッセージ](<${message.url}>)`,
        files: [
          {
            attachment: quote,
            name: 'quote.jpg',
          },
        ],
      });
    },
  },
});
