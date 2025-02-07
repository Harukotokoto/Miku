import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { CustomRole } from '@/modules/CustomRole';

export default new Command({
    name: 'customrole',
    description: 'カスタマイズ可能なカスタムロールを作成できます',
    requiredPermissions: ['Administrator'],
    options: [
        {
            name: 'register',
            description: 'カスタムロールを登録します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'anchor',
                    description:
                        'アンカーとなるロール(この下にロールが作成されます)',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
                {
                    name: 'required_role',
                    description: 'カスタムロールを作成するのに必要なロール',
                    type: ApplicationCommandOptionType.Role,
                },
                {
                    name: 'allow_admin_bypass',
                    description:
                        '管理者権限保持者に必須ロールの設定の無視を許可する',
                    type: ApplicationCommandOptionType.Boolean,
                },
            ],
        },
        {
            name: 'unregister',
            description: 'カスタムロールの設定を削除します',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'anchor',
            description: '基準となるロールを設定します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'anchor',
                    description:
                        'アンカーとなるロール(この下にロールが作成されます)',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        },
        {
            name: 'required_role',
            description: '基準となるロールを設定します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'required_role',
                    description: 'カスタムロールを作成するのに必要なロール',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        },
        {
            name: 'allow_admin_bypass',
            description: '基準となるロールを設定します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'allow_admin_bypass',
                    description:
                        '管理者権限保持者に必須ロールの設定の無視を許可する',
                    type: ApplicationCommandOptionType.Boolean,
                    required: true,
                },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const subcommand = interaction.options.getSubcommand();
            if (!interaction.guild) return;

            const customRole = new CustomRole(interaction.guild);

            if (subcommand === 'register') {
                const anchor = interaction.options.getRole('anchor', true);
                const requiredRole =
                    interaction.options.getRole('required_role');
                const allowAdminBypass =
                    interaction.options.getBoolean('allow_admin_bypass') ||
                    false;

                if (!anchor) return;

                try {
                    await customRole.registerCustomRole({
                        anchorRole: anchor,
                        requiredRole: requiredRole || undefined,
                        options: { allowAdminBypass },
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
                            title: 'カスタムロールを設定しました',
                            description:
                                'メンバーは、`/role create`コマンドで作成することができます',
                            fields: [
                                {
                                    name: 'アンカーロール',
                                    value: anchor.toString(),
                                    inline: true,
                                },
                                {
                                    name: '必須ロール',
                                    value:
                                        requiredRole?.toString() ||
                                        '全員が作成することができます',
                                    inline: true,
                                },
                                {
                                    name: '管理者の必須ロールのバイパス',
                                    value: allowAdminBypass
                                        ? '許可'
                                        : '許可しない',
                                    inline: true,
                                },
                            ],
                            color: Colors.Blue,
                        },
                    ],
                });
            }

            if (subcommand === 'unregister') {
                try {
                    await customRole.unregisterCustomRole();
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
                            description: 'カスタムロールの設定を削除しました',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (subcommand === 'anchor') {
                const anchor = interaction.options.getRole('anchor', true);

                try {
                    await customRole.setAnchorRole(anchor);
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
                            description: `アンカーロールを${anchor}に変更しました`,
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (subcommand === 'required_role') {
                const requiredRole = interaction.options.getRole(
                    'required_role',
                    true,
                );

                try {
                    await customRole.setRequiredRole(requiredRole);
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
                            description: `必要なロールを${requiredRole}に変更しました`,
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (subcommand === 'allow_admin_bypass') {
                const allowAdminBypass = interaction.options.getBoolean(
                    'allow_admin_bypass',
                    true,
                );

                try {
                    await customRole.setOptions({ allowAdminBypass });
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
                            description: `管理者の必須ロールの無視を\`${allowAdminBypass ? '許可' : '許可しない'}\`に変更しました`,
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
    },
});
