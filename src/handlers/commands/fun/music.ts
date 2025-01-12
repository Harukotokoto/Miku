import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord.js';
import { play } from '@/subCommands/music/play';
import { QueueRepeatMode } from 'discord-player';
import { pause } from '@/subCommands/music/pause';
import { queue } from '@/subCommands/music/queue';
import { shuffle } from '@/subCommands/music/shuffle';
import { skip } from '@/subCommands/music/skip';
import { loop } from '@/subCommands/music/loop';

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
        {
            name: 'pause',
            description: '再生を切り替えます',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'queue',
            description: '再生中のキューを表示します',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'shuffle',
            description: 'キュー内の楽曲をシャッフルします',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'skip',
            description: '楽曲をスキップします',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'loop',
            description: 'ループ再生を設定します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'type',
                    description: 'ループの種類',
                    type: ApplicationCommandOptionType.Number,
                    choices: [
                        {
                            name: 'OFF',
                            value: QueueRepeatMode.OFF,
                        },
                        {
                            name: '1曲をループ',
                            value: QueueRepeatMode.TRACK,
                        },
                        {
                            name: 'キューをループ',
                            value: QueueRepeatMode.QUEUE,
                        },
                        {
                            name: '自動再生',
                            value: QueueRepeatMode.AUTOPLAY,
                        },
                    ],
                },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const cmd = interaction.options.getSubcommand();

            if (cmd === 'play') await play({ client, interaction });
            if (cmd === 'pause') await pause({ client, interaction });
            if (cmd === 'queue') await queue({ client, interaction });
            if (cmd === 'shuffle') await shuffle({ client, interaction });
            if (cmd === 'skip') await skip({ client, interaction });
            if (cmd === 'loop') await loop({ client, interaction });
        },
    },
});
