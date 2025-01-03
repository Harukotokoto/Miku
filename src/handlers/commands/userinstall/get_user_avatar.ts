import { Command } from '@/handlers/Command';
import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    Colors,
    InteractionContextType,
} from 'discord.js';

export default new Command({
    name: 'ユーザーのアバターを取得',
    type: ApplicationCommandType.User,
    contexts: [
        InteractionContextType.PrivateChannel,
        InteractionContextType.BotDM,
        InteractionContextType.Guild,
    ],
    integrationTypes: [
        ApplicationIntegrationType.UserInstall,
        ApplicationIntegrationType.GuildInstall,
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const user = interaction.targetUser;

            await interaction.followUp({
                embeds: [
                    {
                        title: `${user.displayName} (${user.tag})のアバター`,
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
        },
    },
});
