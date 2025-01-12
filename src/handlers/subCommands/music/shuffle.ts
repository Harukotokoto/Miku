import { Miku } from '@/libraries/Classes/Miku';
import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { useQueue } from 'discord-player';

export async function shuffle({
    client,
    interaction,
}: {
    client: Miku;
    interaction: ChatInputCommandInteraction;
}) {
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

    if (queue.tracks.size < 2) {
        return interaction.followUp({
            embeds: [
                {
                    description:
                        'シャッフルするには2曲以上楽曲を追加する必要があります',
                    color: Colors.Red,
                    footer: client.footer(),
                },
            ],
        });
    }

    queue.tracks.shuffle();

    return interaction.followUp({
        embeds: [
            {
                description: `${queue.tracks.size}個の楽曲をシャッフルしました`,
                color: Colors.Blue,
                footer: client.footer(),
            },
        ],
    });
}
