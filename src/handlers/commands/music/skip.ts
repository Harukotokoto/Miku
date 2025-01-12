import { Command } from '@/handlers/Command';
import { useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export default new Command({
    name: "skip",
    description: "楽曲をスキップします",
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;
            const queue = useQueue(interaction.guild);

            if (!queue || !queue.isPlaying()) {
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

            queue.node.skip();

            return await interaction.followUp({
                embeds: [
                    {
                        description: 'スキップしました',
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
            });
        }
    }
})