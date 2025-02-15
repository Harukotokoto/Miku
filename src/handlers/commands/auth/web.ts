import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ButtonStyle,
    Colors,
    ComponentType,
} from 'discord.js';
import { encryptUUID } from '@/libraries/Functions/Util/encryption';

export default new Command({
    name: 'web',
    description: 'Web認証を設定します',
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
            const title = interaction.options.getString('title') || 'Web認証';
            const description =
                interaction.options
                    .getString('description')
                    ?.replace('%n', '\n') ||
                'Webでログインして認証します\n' +
                    `認証完了後、${role}が付与されます\n\n` +
                    '-# IPアドレス、メールアドレス等は記録されず、Bot管理者も閲覧できません。\n' +
                    '-# 詳しくは[公式サイト](https://www.harukoto.jp/services/miku)を確認してください';

            const state = `${interaction.guild?.id}_${role.id}`;
            const data = encryptUUID(state);
            const CLIENT_ID = client.user?.id;
            const REDIRECT_URI = encodeURIComponent(
                `${process.env.APP_URL}/auth/callback`,
            );
            const RESPONSE_TYPE = 'code';
            const SCOPE = encodeURIComponent('identify');
            const STATE = encodeURIComponent(data);

            const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&state=${STATE}`;

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
                                style: ButtonStyle.Link,
                                url: oauthUrl,
                            },
                        ],
                    },
                ],
            });
        },
    },
});
