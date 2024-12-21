import { Command } from '@/handlers/Command';
import { ButtonStyle, Colors, ComponentType } from 'discord.js';

export default new Command({
  name: 'about',
  description: 'Mikuに関する情報を表示します',
  execute: {
    interaction: async ({ client, interaction }) => {
      await interaction.followUp({
        embeds: [
          {
            title: 'Mikuについて',
            fields: [
              {
                name: '開発者',
                value:
                  'Harukoto([@harukoto_vlrnt](<https://x.com/harukoto_vlrnt>))',
                inline: true,
              },
              {
                name: '言語',
                value: '`Node.js v22.12.0`,`discord.js@14.16.3`',
                inline: true,
              },
              {
                name: '公式サーバー(**準備中です。仮のサーバーです**)',
                value: 'https://discord.gg/hima',
                inline: true,
              },
              {
                name: 'サーバー数',
                value: `${client.guilds.cache.size}サーバー`,
                inline: true,
              },
              {
                name: 'ユーザー数',
                value: `${client.guilds.cache.filter((guild) => guild.available).reduce((num, guild) => num + guild.memberCount, 0)}人`,
                inline: true,
              },
            ],
            url: 'https://miku.harukoto.jp',
            color: Colors.Blurple,
            footer: client.footer(),
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: '利用規約',
                style: ButtonStyle.Link,
                url: 'https://miku.harukoto.jp/tos',
              },
              {
                type: ComponentType.Button,
                label: 'プライバシーポリシー',
                style: ButtonStyle.Link,
                url: 'https://miku.harukoto.jp/privacy-policy',
              },
              {
                type: ComponentType.Button,
                label: 'ソースコード',
                style: ButtonStyle.Link,
                url: 'https://miku.harukoto.jp/src',
              },
            ],
          },
        ],
      });
    },
  },
});
