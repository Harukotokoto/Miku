import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord.js';
import { play } from '@/libraries/subCommands/music/play';

export default new Command({
    name: 'music',
    description: '音楽を再生します',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'play',
            description: '音楽を再生します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'query',
                    description: '楽曲',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const cmd = interaction.options.getSubcommand();

            if (cmd === 'play') await play({ client, interaction });
        },
    },
});
