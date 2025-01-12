import { Event } from '@/handlers/Event';
import { Colors } from 'discord.js';
import { client } from '@/index';
import ReactionRoleModel from '@/models/ReactionRole';

export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'reaction_role') {
        const member = interaction.guild?.members.cache.get(
            interaction.user.id,
        );
        if (!member) return;

        const message = interaction.message;

        const data = await ReactionRoleModel.findOne({ messageId: message.id });
        if (!data) {
            await interaction.reply({
                embeds: [
                    {
                        description: '削除されたパネルです',
                        color: Colors.Red,
                        footer: client.footer(),
                    },
                ],
                ephemeral: true,
            });

            return await message.delete();
        }

        await interaction.deferReply({ ephemeral: true });

        const selected_roles = interaction.values;

        await interaction.followUp({
            embeds: [
                {
                    title: `${selected_roles.length}個のロールを更新しました`,
                    description: selected_roles
                        .map((roleId, index) => {
                            const role =
                                interaction.guild?.roles.cache.get(roleId);

                            if (!role)
                                return `${index + 1}. 指定されたロールが存在しませんでした`;

                            if (member.roles.cache.has(role.id)) {
                                return `${index + 1}. ${role}を削除しました`;
                            } else {
                                return `${index + 1}. ${role}を付与しました`;
                            }
                        })
                        .join('\n'),
                    color: Colors.Blue,
                    footer: client.footer(),
                },
            ],
            ephemeral: true,
        });

        for (const roleId of selected_roles) {
            const role = interaction.guild?.roles.cache.get(roleId);

            if (role) {
                if (member.roles.cache.has(role.id)) {
                    await member.roles.remove(role);
                } else {
                    await member.roles.add(role);
                }
            }
        }

        await interaction.message.edit({
            embeds: interaction.message.embeds,
            components: interaction.message.components,
        });
    }
});
