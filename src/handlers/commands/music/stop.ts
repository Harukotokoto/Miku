import { Command } from '@/handlers/Command';
import { useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export default new Command({
    name: 'stop',
    description: '楽曲の再生を停止します',
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;
            const queue = useQueue(interaction.guild);

            if (!queue || !queue.isPlaying()) {
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

            queue.delete();

            await interaction.followUp({
                embeds: [
                    {
                        description: '再生を終了しました',
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
            });
        },
    },
});
