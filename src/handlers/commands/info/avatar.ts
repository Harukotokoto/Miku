import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    Colors,
    InteractionContextType,
} from 'discord.js';

export default new Command({
    name: 'avatar',
    description: 'ユーザーのアバターを取得します',
    contexts: [
        InteractionContextType.PrivateChannel,
        InteractionContextType.BotDM,
        InteractionContextType.Guild,
    ],
    integrationTypes: [
        ApplicationIntegrationType.UserInstall,
        ApplicationIntegrationType.GuildInstall,
    ],
    options: [
        {
            name: 'user',
            description: '対象のユーザー',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'type',
            description: '取得するアバターのタイプ',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'デフォルト', value: 'default' },
                { name: 'サーバー', value: 'server' },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const user = interaction.options.getUser('user', true);
            const type = interaction.options.getString('type') || 'default';

            if (type === 'default') {
                await interaction.followUp({
                    embeds: [
                        {
                            title:
                                user.tag +
                                '(' +
                                user.displayName +
                                ') のアバター',
                            image: {
                                url:
                                    user.avatarURL({
                                        size: 1024,
                                        extension: 'png',
                                    }) || user.defaultAvatarURL,
                            },
                            color: Colors.Yellow,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (type === 'server') {
                await interaction.followUp({
                    embeds: [
                        {
                            title:
                                user.tag +
                                '(' +
                                user.displayName +
                                ') のアバター',
                            image: {
                                url: user.displayAvatarURL({
                                    size: 1024,
                                    extension: 'png',
                                }),
                            },
                            color: Colors.Yellow,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
    },
});
