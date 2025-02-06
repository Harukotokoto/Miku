import { Command } from '@/handlers/Command';
import { Leveling } from '@/modules/Leveling';

export default new Command({
    name: 'leaderboard',
    description: 'レベルの上位10名を表示します',
    execute: {
        interaction: async ({ interaction }) => {
            if (!interaction.guild) return;

            const image = await Leveling.createLeaderboard(interaction.guild);

            await interaction.followUp({
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
