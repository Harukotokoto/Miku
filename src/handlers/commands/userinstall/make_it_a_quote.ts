import { Command } from '@/handlers/Command';
import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    InteractionContextType,
} from 'discord.js';
import { MakeItAQuote } from '@/libraries/Classes/Modules/MakeItAQuote';
import { CommandError } from '@/handlers/CommandError';

export default new Command({
    name: 'Make it a Quote',
    type: ApplicationCommandType.Message,
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
            const message = interaction.targetMessage;

            const error = new CommandError(interaction);

            if (!message.cleanContent) {
                return await error.create('テキストが含まれていません');
            }

            const miq = new MakeItAQuote()
                .setText(message.cleanContent)
                .setUsername(message.author.tag)
                .setDisplayName(message.author.displayName)
                .setAvatarURL(message.author.displayAvatarURL({ size: 1024 }))
                .setWatermark(client.user?.tag || '');

            const quote = await miq.build();

            await interaction.followUp({
                content: `[生成元のメッセージ](<${message.url}>)`,
                files: [
                    {
                        attachment: quote,
                        name: 'quote.jpg',
                    },
                ],
            });
        },
    },
});
