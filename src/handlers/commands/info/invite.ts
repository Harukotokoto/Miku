import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { CommandError } from '@/handlers/CommandError';

export default new Command({
  name: 'invite',
  description: 'Botの招待リンクを表示します',
  options: [
    {
      name: 'bot',
      description: '招待リンクを表示するBot',
      type: ApplicationCommandOptionType.User,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.guild) return;
      const userId =
        interaction.options.getUser('bot')?.id || (client.user?.id as string);

      const member = interaction.guild.members.cache.get(userId);

      const error = new CommandError(interaction);
      if (!member)
        return await error.create(
          '指定されたユーザーはサーバー内に存在しません',
        );
      if (!member.user.bot)
        return await error.create('Botを指定する必要があります');

      const baseUrl = 'https://discord.com/oauth2/authorize';

      const url = new URL(baseUrl);

      url.searchParams.set('client_id', member.id);
      url.searchParams.set('permissions', '8');
      url.searchParams.set('integration_type', '0');
      url.searchParams.set('scope', 'bot applications.commands');

      await interaction.followUp({
        embeds: [
          {
            description:
              `[クリックして招待](<${url.toString()}>)\n` +
              interaction.options.getUser('bot')
                ? ''
                : '[ユーザーインストール](<https://discord.com/oauth2/authorize?client_id=1318492572858974268&permissions=8&integration_type=1&scope=bot+applications.commands>)',
            color: Colors.Yellow,
            footer: client.footer(),
          },
        ],
      });
    },
  },
});
