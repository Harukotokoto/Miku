import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { Leveling } from '@/modules/Leveling';

export default new Command({
    name: 'rank',
    description: '現在のレベルを確認します',
    options: [
        {
            name: 'user',
            description: '対象のユーザー',
            type: ApplicationCommandOptionType.User,
        },
    ],
    execute: {
        interaction: async ({ interaction }) => {
            const user =
                interaction.options.getUser('user') || interaction.user;
            if (!interaction.guild) return;

            const leveling = new Leveling(user, interaction.guild);

            const image = await leveling.createRankCard();

            await interaction.followUp({
                files: [
                    {
                        name: 'rank.png',
                        attachment: image,
                    },
                ],
            });
        },
    },
});
