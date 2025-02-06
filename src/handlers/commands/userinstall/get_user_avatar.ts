import { Command } from '@/handlers/Command';
import { ApplicationCommandType, Colors } from 'discord.js';

export default new Command({
    name: 'ユーザーのアバターを取得',
    type: ApplicationCommandType.User,
    userInstall: true,
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
