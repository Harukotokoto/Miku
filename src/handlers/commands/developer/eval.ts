import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
    name: 'eval',
    isOwnerCommand: true,
    description: 'Evalコマンド',
    ephemeral: true,
    options: [
        {
            name: 'content',
            description: 'Discord.js',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    userInstall: true,
    execute: {
        interaction: async ({ interaction }) => {
            const content = interaction.options.getString('content') || '';

            try {
                await new Promise((resolve) => resolve(eval(content)));
                await interaction.followUp('実行しました');
            } catch (err) {
                await interaction.followUp(`${err}`);
            }

            await interaction.followUp('実行しました');

            await new Promise((resolve) => resolve(eval(content)));
        },
        message: async ({ message, args }) => {
            const content = args
                ? args.join(' ')
                : "message.reply('コードが入力されていません')";

            try {
                await new Promise((resolve) => resolve(eval(content)));
                await message.react('✅');
            } catch (err) {
                await message.react('❌');
                await message.reply(`${err}`);
            }
        },
    },
});
