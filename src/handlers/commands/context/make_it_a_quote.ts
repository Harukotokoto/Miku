import { Command } from '@/handlers/Command';
import { ApplicationCommandType, Colors } from 'discord.js';
import { MakeItAQuote } from '@/libraries/Classes/Modules/MakeItAQuote';
import { CommandError } from '@/handlers/CommandError';

export default new Command({
    name: 'Make it a Quote',
    type: ApplicationCommandType.Message,
    userInstall: true,
    execute: {
        interaction: async ({ client, interaction }) => {
            const message = interaction.targetMessage;

            const error = new CommandError(interaction);

            if (
                message.embeds[0] &&
                message.embeds[0].image?.url.startsWith(
                    'https://25dsnipe.com/',
                ) &&
                message.embeds[0].description &&
                message.author.id === client.user?.id
            ) {
                const userId = message.embeds[0].image.url.split(
                    'https://25dsnipe.com/',
                )[1];
                const user = client.users.cache.get(userId);
                if (!user) return;
                const miq = new MakeItAQuote()
                    .setText(
                        message.embeds[0].color === Colors.Aqua
                            ? message.embeds[0].description
                            : message.embeds[0].description.split(' => ')[0],
                    )
                    .setUsername(user.tag)
                    .setDisplayName(user.displayName)
                    .setAvatarURL(user.displayAvatarURL({ size: 1024 }))
                    .setWatermark(client.user?.tag || '')
                    .setColor();

                const quote = await miq.build();

                await interaction.followUp({
                    content: `[Snipeから作成](${message.url})`,
                    files: [
                        {
                            attachment: quote,
                            name: 'quote.jpg',
                        },
                    ],
                });
            } else {
                if (!message.cleanContent) {
                    return await error.create('テキストが含まれていません');
                }

                const miq = new MakeItAQuote()
                    .setText(message.cleanContent)
                    .setUsername(message.author.tag)
                    .setDisplayName(message.author.displayName)
                    .setAvatarURL(
                        message.author.displayAvatarURL({ size: 1024 }),
                    )
                    .setWatermark(client.user?.tag || '')
                    .setColor();

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
            }
        },
    },
});
