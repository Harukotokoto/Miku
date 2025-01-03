import { Event } from '@/handlers/Event';
import { Colors, PermissionFlagsBits } from 'discord.js';
import { client } from '@/index';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId.startsWith('oneclick-')) {
    await interaction.deferReply({ ephemeral: true });
    const roleId = interaction.customId.split('-')[1];
    const role = await interaction.guild?.roles.fetch(roleId);
    if (!role) {
      return await interaction.followUp({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: '設定されたロールが存在しません',
            color: Colors.Red,
            footer: {
              text: 'サーバー管理者に報告してください',
            },
          },
        ],
      });
    }

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) return;

    if (member.roles.cache.has(role.id)) {
      return await interaction.followUp({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: '既に認証されています',
            color: Colors.Red,
            footer: client.footer(),
          },
        ],
      });
    }

    const me = interaction.guild?.members.cache.get(client.user?.id as string);
    if (!me) return;

    if (
      me.roles.highest.position < role.position ||
      !me.permissions.has(PermissionFlagsBits.ManageRoles)
    ) {
      return await interaction.followUp({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: '権限が足りず、Botがロールを付与することができません',
            color: Colors.Red,
            footer: client.footer(),
          },
        ],
      });
    }

    await member.roles.add(role);

    await interaction.followUp({
      embeds: [
        {
          title: '認証しました',
          description: `${role}が付与されました`,
          color: Colors.Green,
          footer: client.footer(),
        },
      ],
    });
  }
});
