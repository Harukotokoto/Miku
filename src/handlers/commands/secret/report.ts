import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType, ApplicationIntegrationType, Colors, InteractionContextType } from 'discord.js';
import { CoolTime } from '@/libraries/Classes/Utils/CoolTime';

export default new Command({
  name: 'report',
  isOwnerCommand: true,
  description: 'report',
  contexts: [
    InteractionContextType.PrivateChannel,
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
  ],
  integrationTypes: [
    ApplicationIntegrationType.UserInstall,
    ApplicationIntegrationType.GuildInstall,
  ],
  options: [
    {
      name: 'user',
      description: 'ユーザーを通報します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'ユーザー',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        // {
        //   name: 'threads',
        //   description: 'スレッド数',
        //   type: ApplicationCommandOptionType.Integer,
        //   choices: [{ name: "1", value: 1 }]
        // }
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const cmd = interaction.options.getSubcommand();

      const ct = new CoolTime(interaction.user.id);
      const cooldown = ct.getCoolTime(1000 * 60 * 60 * 3);

      if (cooldown) {
        const next = ct.getNextAvailableTime(1000 * 60 * 60 * 3);
        if (!next) return;

        return await interaction.followUp({
          embeds: [
            {
              title: 'エラーが発生しました',
              description:
                '3時間に1回のみコマンドを実行することができます。\n' +
                `次は<t:${next}:R>に実行できます`,
              color: Colors.Red,
              footer: client.footer(),
            },
          ],
        });
      }

      if (cmd === 'user') {
        ct.setCoolTime();
        const user = interaction.options.getUser('user', true);

        await interaction.followUp({
          embeds: [
            {
              title: 'ユーザーを通報',
              description:
                `${user.displayName}(${user.tag})を通報します\n` +
                '- **Target:**\n' +
                `  - **Name:** ${user.username}\n` +
                `  - **ID:** ${user.id}\n` +
                '- **Status:**\n' +
                '  - **Threads:** 1/1\n' +
                '  - **Request:** 0/6000',
              color: Colors.Blue,
              footer: client.footer(),
            },
          ],
        });

        let sum = 0;
        const target = 6000;

        while (sum !== target) {
          const delay = Math.floor(Math.random() * 1800) + 1200;

          const addend = Math.floor(Math.random() * 320) + 220;

          if (sum + addend > target) {
            sum = 6000;
            continue;
          }

          sum += addend;

          await interaction.editReply({
            embeds: [
              {
                title: 'ユーザーを通報',
                description:
                  `${user.displayName}(${user.tag})を通報します\n` +
                  '- **Target:**\n' +
                  `  - **Name:** ${user.username}\n` +
                  `  - **ID:** ${user.id}\n` +
                  '- **Status:**\n' +
                  '  - Threads: 1/1\n' +
                  `  - Request: ${sum}/6000`,
                color: Colors.Blue,
                footer: client.footer(),
              },
            ],
          });

          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        await interaction.editReply({
          embeds: [
            {
              title: '✅ 通報が完了しました',
              description:
                '**リクエストした回数:** 6000\n' +
                `**成功した回数:** ${Math.floor(Math.random() * (3000 - 600 + 1)) + 600}\n` +
                `**予測成功確率:** ${(Math.random() * (42.0 - 0.2) + 0.2).toFixed(2)}%`,
              color: Colors.Green,
              footer: client.footer(),
            },
          ],
        });
      }
    },
  },
});
