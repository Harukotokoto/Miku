import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ButtonStyle,
    Colors,
    ComponentType,
} from 'discord.js';

export default new Command({
    name: 'math',
    description: '簡単な数学の問題を解かせ、13以上かを確認する認証を設置します',
    requiredPermissions: ['ManageRoles', 'ManageGuild'],
    options: [
        {
            name: 'setup',
            description: 'ワンクリック認証を設定します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: '認証完了時に付与するロール',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
                {
                    name: 'title',
                    description: 'タイトル',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 32,
                    minLength: 1,
                },
                {
                    name: 'description',
                    description: '説明 (%nで改行できます)',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 1024,
                    minLength: 1,
                },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const role = interaction.options.getRole('role', true);
            const title =
                interaction.options.getString('title') || '数学問題式認証';
            const description =
                interaction.options
                    .getString('description')
                    ?.replace('%n', '\n') ||
                'ボタンを押して認証します\n' +
                    `認証完了後、${role}が付与されます`;

            await interaction.followUp({
                embeds: [
                    {
                        title: title,
                        description: description,
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: '認証',
                                emoji: '✅',
                                customId: `math-${role.id}`,
                                style: ButtonStyle.Success,
                            },
                        ],
                    },
                ],
            });
        },
    },
});
