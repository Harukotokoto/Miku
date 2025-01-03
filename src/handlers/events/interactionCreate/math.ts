import { Event } from '@/handlers/Event';
import {
  Colors,
  ComponentType,
  PermissionFlagsBits,
  TextInputStyle,
} from 'discord.js';
import { client } from '@/index';
import { generateRandomEquation } from '@/libraries/Functions/Util/generateRandamEquation';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId.startsWith('math-')) {
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
      return await interaction.reply({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: '既に認証されています',
            color: Colors.Red,
            footer: client.footer(),
          },
        ],
        ephemeral: true,
      });
    }

    const me = interaction.guild?.members.cache.get(client.user?.id as string);
    if (!me) return;

    if (
      me.roles.highest.position < role.position ||
      !me.permissions.has(PermissionFlagsBits.ManageRoles)
    ) {
      return await interaction.reply({
        embeds: [
          {
            title: 'エラーが発生しました',
            description: '権限が足りず、Botがロールを付与することができません',
            color: Colors.Red,
            footer: client.footer(),
          },
        ],
        ephemeral: true,
      });
    }

    const equation = generateRandomEquation();

    await interaction.showModal({
      title: '認証します',
      customId: 'equation_modal',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              label: `方程式を解いてください: ${equation.question}`,
              customId: 'equation_input',
              style: TextInputStyle.Short,
            },
          ],
        },
      ],
    });

    const submitted = await interaction
      .awaitModalSubmit({
        time: 60000,
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch((error) => {
        console.error(error);
        return null;
      });

    if (submitted) {
      if (submitted.customId !== 'equation_modal') return;
      const answer = submitted.fields.getTextInputValue('equation_input');

      if (answer !== equation.answer?.toString()) {
        return await submitted.reply({
          embeds: [
            {
              title: 'エラーが発生しました',
              description: '回答が違います',
              color: Colors.Red,
              footer: client.footer(),
            },
          ],
          ephemeral: true,
        });
      }

      await member.roles.add(role);

      await submitted.reply({
        embeds: [
          {
            title: '認証しました',
            description: `${role}が付与されました`,
            color: Colors.Green,
            footer: client.footer(),
          },
        ],
        ephemeral: true,
      });
    }
  }
});
