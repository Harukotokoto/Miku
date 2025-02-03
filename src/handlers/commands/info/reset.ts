import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ButtonStyle,
    Colors,
    ComponentType,
} from 'discord.js';
import { Leveling } from '@/modules/Leveling';

export default new Command({
    name: 'reset',
    description: 'レベルをリセットします',
    options: [
        {
            name: 'user',
            description: 'ユーザーのレベルをリセットします',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'リセット対象のユーザー',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
        {
            name: 'server',
            description: 'サーバー全体のレベルをリセットします',
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;

            const cmd = interaction.options.getSubcommand();

            if (cmd === 'server') {
                await interaction.followUp({
                    embeds: [
                        {
                            title: 'レベルをリセットしてもよろしいですか？',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Danger,
                                    label: 'はい',
                                    customId: 'guild-yes',
                                },
                                {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Success,
                                    label: 'キャンセル',
                                    customId: 'guild-cancel',
                                },
                            ],
                        },
                    ],
                });
            } else {
                const user = interaction.options.getUser('user', true);
                await interaction.followUp({
                    embeds: [
                        {
                            title: `${user}のレベルをリセットしてもよろしいですか？`,
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Danger,
                                    label: 'はい',
                                    customId: 'user-yes',
                                },
                                {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Success,
                                    label: 'キャンセル',
                                    customId: 'user-cancel',
                                },
                            ],
                        },
                    ],
                });
            }

            const msg = await interaction.fetchReply();

            const collector = msg.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 1000 * 30,
            });

            collector.on('collect', async (i) => {
                if (!i.isButton()) return;

                if (
                    i.customId === 'guild-cancel' ||
                    i.customId === 'user-cancel'
                ) {
                    i.update({
                        embeds: [
                            {
                                description: 'キャンセルしました',
                                color: Colors.Gold,
                                footer: client.footer(),
                            },
                        ],
                        components: [],
                    });

                    return;
                }

                if (i.customId === 'guild-yes') {
                    await Leveling.resetGuild(interaction.guild!);

                    i.update({
                        embeds: [
                            {
                                description:
                                    'サーバー内のすべてのユーザーのレベルをリセットしました',
                                color: Colors.Green,
                                footer: client.footer(),
                            },
                        ],
                        components: [],
                    });

                    return;
                }

                if (i.customId === 'user-yes') {
                    const user = interaction.options.getUser('user', true);
                    const leveling = new Leveling(user, interaction.guild!);

                    await leveling.resetUser();

                    i.update({
                        embeds: [
                            {
                                description: `${user}のレベルをリセットしました`,
                                color: Colors.Green,
                                footer: client.footer(),
                            },
                        ],
                        components: [],
                    });

                    return;
                }
            });
        },
    },
});
