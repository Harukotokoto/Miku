import { Command } from '@/handlers/Command';
import { createBar } from '@/libraries/Functions/Util/createBar';
import { Colors } from 'discord.js';

export default new Command({
  name: 'server',
  description: 'サーバーの情報を表示します',
  execute: {
    interaction: async ({ client, interaction }) => {
      const guild = interaction.guild;
      if (!guild) return;

      const verification_levels = {
        0: '無し',
        1: '低',
        2: '中',
        3: '高',
        4: '最高',
      };

      const createBoostBar = () => {
        const boostCount = guild.premiumSubscriptionCount ?? 0;
        const boostLevel = guild.premiumTier;

        switch (boostLevel) {
          case 0:
            return (
              `レベル無し | ${boostCount === 0 ? '未' : boostCount}ブースト\n` +
              createBar(boostCount, 2) +
              `\n次のレベルまで: ${boostCount}/2`
            );
          case 1:
            return (
              `レベル ${boostLevel} | ${boostCount}ブースト\n` +
              createBar(boostCount, 7) +
              `\n次のレベルまで: ${boostCount}/7`
            );
          case 2:
            return (
              `レベル ${boostLevel} | ${boostCount}ブースト\n` +
              createBar(boostCount, 14) +
              `\n次のレベルまで: ${boostCount}/14`
            );
          case 3:
            return (
              `レベル ${boostLevel} | ${boostCount}ブースト\n` +
              createBar(14, 14) +
              '\nブーストレベル最大🎉'
            );
        }
      };

      await interaction.followUp({
        embeds: [
          {
            author: {
              name: guild.name,
              icon_url: guild.iconURL()?.toString(),
            },
            image: {
              url: guild.bannerURL()?.toString() || '',
            },
            fields: [
              {
                name: 'サーバー作成日',
                value:
                  '<t:' + Math.round(guild.createdAt.getTime() / 1000) + '>',
                inline: true,
              },
              {
                name: 'サーバー所有者',
                value: '<@!' + (await guild.fetchOwner()).id + '>',
                inline: true,
              },
              {
                name: 'メンバー数',
                value: guild.memberCount + '人',
                inline: true,
              },
              {
                name: 'BANされたユーザー数',
                value: (await guild.bans.fetch()).size.toString() + 'メンバー',
                inline: true,
              },
              {
                name: '認証レベル',
                value: verification_levels[guild.verificationLevel],
                inline: true,
              },
              {
                name: 'サーバーブースト進行度',
                value: createBoostBar() ?? '生成中にエラーが発生しました',
              },
            ],
            color: Colors.Gold,
            footer: client.footer(),
          },
        ],
      });
    },
  },
});
