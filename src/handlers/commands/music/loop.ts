import { Command } from '@/handlers/Command';
import { QueueRepeatMode, useQueue } from 'discord-player';
import { ApplicationCommandOptionType, Colors } from 'discord.js';

export default new Command({
    name: 'loop',
    description: 'ループ再生の設定をします',
    options: [
        {
            name: 'mode',
            description: 'モード',
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
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;
            const queue = useQueue(interaction.guild);

            if (!queue) {
                return await interaction.followUp({
                    embeds: [
                        {
                            description: '楽曲が再生されていません',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            const loopMode = interaction.options.getNumber('mode', true) as
                | 0
                | 1
                | 2
                | 3;

            queue.setRepeatMode(loopMode);

            const modeDictionary: Record<QueueRepeatMode, string> = {
                0: 'OFF',
                1: '1曲をループ',
                2: 'キューをループ',
                3: '自動再生',
            };

            return await interaction.followUp({
                embeds: [
                    {
                        description: `ループ設定を**${modeDictionary[loopMode]}**に設定しました`,
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
            });
        },
    },
});
