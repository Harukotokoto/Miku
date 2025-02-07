import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { CustomRole } from '@/modules/CustomRole';

export default new Command({
    name: 'role',
    description: 'カスタムロールを編集します',
    options: [
        {
            name: 'create',
            description: 'カスタムロールを作成します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'ロール名',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'color',
                    description: 'ロールの色(HEX Color)',
                    type: ApplicationCommandOptionType.String,
                    minLength: 6,
                    maxLength: 7,
                },
                {
                    name: 'icon',
                    description: 'ロールアイコン',
                    type: ApplicationCommandOptionType.Attachment,
                },
            ],
        },
        {
            name: 'name',
            description: 'ロール名を変更します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'ロール名',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 32,
                    required: true,
                },
            ],
        },
        {
            name: 'color',
            description: 'ロールの色を変更します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'color',
                    description: 'ロールの色(HEX Color)',
                    type: ApplicationCommandOptionType.String,
                    minLength: 6,
                    maxLength: 7,
                    required: true,
                },
            ],
        },
        {
            name: 'icon',
            description: 'ロールアイコンを変更します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'icon',
                    description: 'ロールアイコン',
                    type: ApplicationCommandOptionType.Attachment,
                    required: true,
                },
            ],
        },
        {
            name: 'delete',
            description: 'カスタムロールを削除します',
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const cmd = interaction.options.getSubcommand();
            if (!interaction.guild) return;

            const customRole = new CustomRole(interaction.guild);

            const member = await interaction.guild.members.fetch(
                interaction.user.id,
            );
            if (!member) return;

            if (cmd === 'create') {
                const name = interaction.options.getString('name', true);
                const color =
                    interaction.options.getString('color') || undefined;
                const attachment =
                    interaction.options.getAttachment('icon') || undefined;

                if (attachment) {
                    const attachmentSize = attachment.size;
                    if (attachmentSize > 256 * 1024) {
                        await interaction.followUp({
                            embeds: [
                                {
                                    description:
                                        'ロールアイコンのファイルサイズは256KB以下にしてください。',
                                    color: Colors.Red,
                                },
                            ],
                        });
                        return;
                    }

                    const attachmentType = attachment.contentType;
                    if (!attachmentType) return;

                    if (
                        !['image/png', 'image/jpeg', 'image/gif'].includes(
                            attachmentType,
                        )
                    ) {
                        await interaction.followUp({
                            embeds: [
                                {
                                    description:
                                        'ロールアイコンはPNG、JPEG、GIFのいずれかでなければなりません。',
                                    color: Colors.Red,
                                },
                            ],
                        });
                        return;
                    }
                }

                try {
                    await customRole.createCustomRole(member, {
                        name,
                        color,
                        attachment,
                    });
                } catch (err) {
                    await interaction.followUp({
                        embeds: [
                            {
                                description: `${err}`,
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
                            description: `カスタムロールを作成しました`,
                            color: Colors.Green,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (cmd === 'name') {
                const name = interaction.options.getString('name', true);

                try {
                    await customRole.setName(member, name);
                } catch (err) {
                    await interaction.followUp({
                        embeds: [
                            {
                                description: `${err}`,
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
                            description: `ロール名を\`${name}\`に変更しました`,
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (cmd === 'color') {
                const color = interaction.options.getString('color', true);

                try {
                    await customRole.setColor(member, color);
                } catch (err) {
                    await interaction.followUp({
                        embeds: [
                            {
                                description: `${err}`,
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
                            description: 'ロールカラーを変更しました',
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (cmd === 'icon') {
                const attachment = interaction.options.getAttachment(
                    'icon',
                    true,
                );

                try {
                    await customRole.setIcon(member, attachment);
                } catch (err) {
                    await interaction.followUp({
                        embeds: [
                            {
                                description: `${err}`,
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
                            description: 'ロールアイコンを変更しました',
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (cmd === 'delete') {
                try {
                    await customRole.removeCustomRole(member);
                } catch (err) {
                    await interaction.followUp({
                        embeds: [
                            {
                                description: `${err}`,
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
                            description: 'カスタムロールを削除しました',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
    },
});
