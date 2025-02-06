import { Command } from '@/handlers/Command';
import { useTimeline } from 'discord-player';
import { Colors } from 'discord.js';

export default new Command({
    name: 'pause',
    description: '楽曲の再生を一時停止・再開します',
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;
            const timeline = useTimeline({
                node: interaction.guild,
            });

            if (!timeline) {
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

            const wasPaused = timeline.paused;

            wasPaused ? timeline.resume() : timeline.pause();

            await interaction.followUp({
                embeds: [
                    {
                        description: `楽曲の再生を${wasPaused ? '再開' : '一時停止'}しました`,
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
            });
        },
    },
});
