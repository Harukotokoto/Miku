import { Command } from '@/handlers/Command';
import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  Colors,
  InteractionContextType,
} from 'discord.js';

export default new Command({
  name: 'みどねるをタイムアウト',
  type: ApplicationCommandType.User,
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
      const user = interaction.targetUser;
      const member = await interaction.guild?.members.fetch(user.id);

      if (!member) return;

      const midoneru_accounts: string[] = ['1155331881932439633'];

      if (!midoneru_accounts.includes(member.id)) {
        return await interaction.followUp({
          embeds: [
            {
              title: 'エラーが発生しました',
              description: 'みどねるのみタイムアウトすることができます',
              color: Colors.Red,
              footer: client.footer(),
            },
          ],
        });
      }

      await member.timeout(60 * 10);

      await interaction.followUp({
        embeds: [
          {
            title: `みどねるをタイムアウトしました`,
            description: 'このコマンドは誰でも使用することができます',
            color: Colors.Yellow,
            footer: client.footer(),
          },
        ],
      });
    },
  },
});
