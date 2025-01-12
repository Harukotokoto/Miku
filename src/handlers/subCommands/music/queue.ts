import { Miku } from '@/libraries/Classes/Miku';
import { APIEmbed, ChatInputCommandInteraction, Colors } from 'discord.js';
import { Track, useQueue } from 'discord-player';
import { Pagination } from '@/libraries/Classes/Utils/Pagination';
import { chunkArray } from '@/libraries/Functions/chunkArray';

export async function queue({
    client,
    interaction,
}: {
    client: Miku;
    interaction: ChatInputCommandInteraction;
}) {
    if (!interaction.guild) return;
    const queue = useQueue(interaction.guild);

    if (!queue || !queue.currentTrack) {
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

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.toArray();

    if (!currentTrack) {
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

    if (tracks.length < 1) {
        return await interaction.followUp({
            embeds: [
                {
                    title: `キュー - ページ 1`,
                    description: `**現在再生中:** [${currentTrack.title}](${currentTrack.url}) - ${currentTrack.author}`,
                    color: Colors.Blue,
                    footer: client.footer(),
                },
            ],
        });
    }

    const chunkedTracks: Track[][] = chunkArray(tracks, 10);

    const pages: APIEmbed[] = chunkedTracks.map(
        (trackGroup: Track[], index) => {
            return {
                title: `キュー - ページ ${index + 1}`,
                description: [
                    `**現在再生中:** [${currentTrack.title}](${currentTrack.url}) - ${currentTrack.author}`,
                    '',
                    '**次の楽曲:**',
                    trackGroup
                        .map(
                            (track, i) =>
                                `${index * 10 + i + 1}. [${track.title}](${track.url}) - ${track.author}`,
                        )
                        .join('\n'),
                ].join('\n'),
                color: Colors.Blue,
                footer: client.footer(),
            };
        },
    );

    console.log(pages);

    if (pages.length < 2) {
        await interaction.followUp({
            embeds: pages,
        });
    } else {
        const pagination = new Pagination({
            interaction: interaction,
            items: pages,
            maxPages: pages.length,
        });

        await pagination.build();
    }
}
