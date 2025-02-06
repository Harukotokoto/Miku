import { Command } from '@/handlers/Command';
import { useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export default new Command({
    name: 'shuffle',
    description: 'キュー内の楽曲をシャッフルします',
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;
            const queue = useQueue(interaction.guild);

            if (!queue) {
                await interaction.followUp({
                    embeds: [
                        {
                            description: '楽曲が再生されていません',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });

                return;
            }

            if (queue.tracks.size < 2) {
                await interaction.followUp({
                    embeds: [
                        {
                            description:
                                'シャッフルするには2曲以上楽曲を追加する必要があります',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });

                return;
            }

            queue.tracks.shuffle();

            await interaction.followUp({
                embeds: [
                    {
                        description: `${queue.tracks.size}個の楽曲をシャッフルしました`,
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
            });
        },
    },
});
