import { Miku } from '@/libraries/Classes/Miku';
import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { useQueue } from 'discord-player';

export async function skip({
    client,
    interaction,
}: {
    client: Miku;
    interaction: ChatInputCommandInteraction;
}) {
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
