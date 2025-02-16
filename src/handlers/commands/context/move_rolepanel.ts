import { Command } from '@/handlers/Command';
import {
    ApplicationCommandType,
    ButtonStyle,
    ChannelType,
    Colors,
    ComponentType,
} from 'discord.js';
import { randomUUID } from 'crypto';
import { ReactionRole } from '@/modules/ReactionRole';
import { extractRoleIds } from '@/libraries/Functions/Util/extractRoleIds';

export default new Command({
    name: '役職パネルから移行する',
    type: ApplicationCommandType.Message,
    requiredPermissions: ["ManageGuild"],
    userInstall: false,
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;

            const message = interaction.targetMessage;

            if (message.author.id !== '971523089550671953') {
                await interaction.followUp({
                    embeds: [
                        {
                            description:
                                '役職パネルv3からのみ移行することができます。',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });

                return;
            }

            const title = message.embeds[0].title;
            const description = message.embeds[0].description;
            if (!description || !title) {
                await interaction.followUp({
                    embeds: [
                        {
                            description: 'データが見つかりませんでした。',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });

                return;
            }

            const roles = extractRoleIds(description);

            const reactionRole = new ReactionRole(interaction.guild);

            const rr_id = `rpv3_${randomUUID()}`;

            if (
                interaction.channel?.type !== ChannelType.GuildText &&
                interaction.channel?.type !== ChannelType.GuildAnnouncement
            )
                return;

            await reactionRole.create(rr_id, {
                title,
                channel: interaction.channel,
            });

            for (const roleId of roles) {
                const role = await interaction.guild.roles.fetch(roleId);
                if (!role) continue;

                await reactionRole.roles.add(rr_id, {
                    role,
                });
            }

            await reactionRole.refresh(rr_id);

            await interaction.followUp({
                embeds: [
                    {
                        title: '役職パネルv3からの移行が完了しました',
                        description: `識別ID: ${rr_id}`,
                        color: Colors.Green,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: '元のパネルを削除する',
                                style: ButtonStyle.Danger,
                                customId: 'delete_rp3',
                            },
                        ],
                    },
                ],
            });

            const msg = await interaction.fetchReply();

            const collector = msg.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 1000 * 60,
            });

            collector.on('collect', async (i) => {
                if (!i.isButton()) return;
                if (i.customId === 'delete_rp3') {
                    try {
                        await message.delete();
                        i.reply('パネルを削除しました');
                    } catch (e) {
                        i.reply('パネルの削除に失敗しました');
                    }
                }
            });

            collector.on('end', async () => {
                await msg.edit({
                    components: [],
                });
            });
        },
    },
});
