import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { Leveling } from '@/modules/Leveling';

export default new Command({
    name: 'leaderboard',
    description: 'レベルの上位10名を表示します',
    execute: {
        interaction: async ({ client, interaction }) => {
            const user =
                interaction.options.getUser('user') || interaction.user;
            if (!interaction.guild) return;

            const image = await Leveling.createLeaderboard(interaction.guild);

            return await interaction.followUp({
                files: [
                    {
                        name: 'leaderboard.png',
                        attachment: image,
                    },
                ],
            });
        },
    },
});
