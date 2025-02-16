import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType, ChannelType, Colors } from 'discord.js';
import { ReactionRole } from '@/modules/ReactionRole';
import ReactionRoleModel from '@/models/ReactionRole';

export default new Command({
    name: 'reactionrole',
    description: 'リアクションロールの設定を行います',
    ephemeral: true,
    requiredPermissions: ['ManageGuild', 'ManageRoles'],
    options: [
        {
            name: 'create',
            description: 'リアクションロールを作成しパネルを設定します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'panel_id',
                    description: 'パネルの識別名',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'title',
                    description: 'パネルのタイトル',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'description',
                    description: 'パネルの説明("//"で改行)',
                    type: ApplicationCommandOptionType.String,
                },
            ],
        },
        {
            name: 'remove',
            description: 'リアクションロールを削除します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'panel_id',
                    description: 'パネルの識別名',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
        },
        {
            name: 'add',
            description: 'ロールを追加します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'panel_id',
                    description: 'パネルの識別名',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                    required: true,
                },
                {
                    name: 'role',
                    description: '追加するロール',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
                {
                    name: 'label',
                    description: '表示名',
                    type: ApplicationCommandOptionType.String,
                },
            ],
        },
        {
            name: 'delete',
            description: 'ロールを削除します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'panel_id',
                    description: 'パネルの識別名',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                    required: true,
                },
                {
                    name: 'role',
                    description: '削除するロール',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        },
        {
            name: 'refresh',
            description: 'パネルを再読み込みします',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'panel_id',
                    description: 'パネルの識別名',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                    required: true,
                },
            ],
        },
    ],
    execute: {
        autoComplete: async ({ interaction }) => {
            const option = interaction.options.getFocused(true);
            if (option.name === 'panel_id') {
                const reaction_roles = await ReactionRoleModel.find({
                    guildId: interaction.guild?.id,
                });
                if (!reaction_roles) return;

                await interaction.respond(
                    reaction_roles.map((data) => {
                        return {
                            name: data.rrId,
                            value: data.rrId,
                        };
                    }),
                );
            }
        },
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;
            const reactionRole = new ReactionRole(interaction.guild);
            const rr_id = interaction.options.getString('panel_id', true);

            const role = interaction.options.getRole('role');

            switch (interaction.options.getSubcommand()) {
                case 'create': {
                    const title = interaction.options.getString('title');
                    const description =
                        interaction.options.getString('description');

                    if (
                        interaction.channel?.type !== ChannelType.GuildText &&
                        interaction.channel?.type !==
                            ChannelType.GuildAnnouncement
                    )
                        return;

                    try {
                        await reactionRole.create(rr_id, {
                            channel: interaction.channel,
                            title,
                            description,
                        });
                    } catch (e) {
                        await interaction.followUp({
                            embeds: [
                                {
                                    description: `${e}`,
                                    color: Colors.Red,
                                    footer: client.footer(),
                                },
                            ],
                        });

                        return;
                    }

                    await interaction.followUp({
                        embeds: [
                            {
                                title: 'パネルを新規作成しました',
                                description: `識別ID: ${rr_id}`,
                                color: Colors.Green,
                                footer: client.footer(),
                            },
                        ],
                    });

                    break;
                }
                case 'remove': {
                    try {
                        await reactionRole.remove(rr_id);
                    } catch (e) {
                        await interaction.followUp({
                            embeds: [
                                {
                                    description: `${e}`,
                                    color: Colors.Red,
                                    footer: client.footer(),
                                },
                            ],
                        });

                        return;
                    }

                    await interaction.followUp({
                        embeds: [
                            {
                                title: 'パネルを削除しました',
                                color: Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                    });
                    break;
                }
                case 'add': {
                    if (!role) return;
                    const label = interaction.options.getString('label');

                    try {
                        await reactionRole.roles.add(rr_id, {
                            role,
                            label,
                        });
                    } catch (e) {
                        await interaction.followUp({
                            embeds: [
                                {
                                    description: `${e}`,
                                    color: Colors.Red,
                                    footer: client.footer(),
                                },
                            ],
                        });

                        return;
                    }

                    await interaction.followUp({
                        embeds: [
                            {
                                title: 'ロールを追加しました',
                                description:
                                    `追加したロール: ${role.toString()}\n` +
                                    `表示名: ${label || role.name}`,
                                color: Colors.Green,
                                footer: client.footer(),
                            },
                        ],
                    });
                    break;
                }
                case 'delete': {
                    if (!role) return;
                    try {
                        await reactionRole.roles.delete(rr_id, { role });
                    } catch (e) {
                        await interaction.followUp({
                            embeds: [
                                {
                                    description: `${e}`,
                                    color: Colors.Red,
                                    footer: client.footer(),
                                },
                            ],
                        });

                        return;
                    }

                    await interaction.followUp({
                        embeds: [
                            {
                                title: 'ロールを削除しました',
                                description:
                                    `識別ID: ${rr_id}\n\n` +
                                    `削除したロール: $role.toString()}\n`,
                                color: Colors.Green,
                                footer: client.footer(),
                            },
                        ],
                    });
                    break;
                }
                case 'refresh': {
                    await interaction.followUp({
                        embeds: [
                            {
                                description: 'パネルを再描画します',
                                color: Colors.Blue,
                                footer: client.footer(),
                            },
                        ],
                    });
                    break;
                }
            }

            await reactionRole.refresh(rr_id);
        },
    },
});
