import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    Colors,
    InteractionContextType,
} from 'discord.js';
import { CommandError } from '@/handlers/CommandError';

export default new Command({
    name: 'invite',
    description: 'Botの招待リンクを表示します',
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
            name: 'bot',
            description: '招待リンクを表示するBot',
            type: ApplicationCommandOptionType.User,
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const user = interaction.options.getUser('bot') || client.user;

            const error = new CommandError(interaction);

            if (!user) return await error.create('不明なユーザーです');
            if (!user.bot)
                return await error.create('Botを指定する必要があります');

            const baseUrl = 'https://discord.com/oauth2/authorize';

            const url = new URL(baseUrl);

            url.searchParams.set('client_id', user.id);
            url.searchParams.set('permissions', '8');
            url.searchParams.set('integration_type', '0');
            url.searchParams.set('scope', 'bot applications.commands');

            await interaction.followUp({
                embeds: [
                    {
                        description: interaction.options.getUser('bot')
                            ? `[クリックして招待](<${url.toString()}>)`
                            : `[クリックして招待](<${url.toString()}>)\n[ユーザーインストール](<https://discord.com/oauth2/authorize?client_id=1318492572858974268&integration_type=1&scope=applications.commands>)`,
                        color: Colors.Yellow,
                        footer: client.footer(),
                    },
                ],
            });
        },
    },
});
