import { Command } from '@/handlers/Command';
import {
    APIEmbed,
    APISelectMenuOption,
    ApplicationCommandOptionType,
    Colors,
    ComponentType,
    MessageComponentInteraction,
} from 'discord.js';
import { QueryType, useMainPlayer, useQueue } from 'discord-player';
import { truncateText } from '@/libraries/Functions/truncateText';

export default new Command({
    name: 'play',
    description: '楽曲を再生します (YouTube)',
    options: [
        {
            name: 'query',
            description: '楽曲',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;

            const member = await interaction.guild.members.fetch(
                interaction.user.id,
            );
            if (!member) return;

            const channel = member.voice.channel;
            if (!channel)
                return interaction.followUp({
                    embeds: [
                        {
                            description:
                                'まずはボイスチャットに参加する必要があります',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });

            const player = useMainPlayer();
            const query = interaction.options.getString('query', true);

            const searchResult = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (!searchResult || !searchResult.tracks.length) {
                return await interaction.followUp({
                    embeds: [
                        {
                            description: '検索結果がありませんでした',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            const tracks = searchResult.tracks;

            if (
                searchResult.hasPlaylist() ||
                searchResult.tracks.length === 1
            ) {
                let queue = useQueue(interaction.guild);

                if (!queue) {
                    queue = player.queues.create(interaction.guild, {
                        metadata: interaction.channel,
                    });
                }

                if (!queue.connection) {
                    await queue.connect(channel);
                }

                queue.addTrack(tracks);

                if (!queue.isPlaying()) {
                    queue.node.setVolume(35);
                    await queue.node.play();
                }

                return await interaction.editReply({
                    embeds: [
                        tracks.length !== 1
                            ? {
                                  description: `${tracks.length}個の楽曲ををキューに追加しました`,
                                  color: Colors.Blue,
                                  footer: client.footer(),
                              }
                            : undefined,
                        {
                            title: '🎵 再生中 🎵',
                            description: `[${tracks[0].title}](${tracks[0].url}) - ${tracks[0].author}`,
                            image: {
                                url: tracks[0].thumbnail,
                            },
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ].filter((embed) => embed !== undefined),
                    components: [],
                });
            }

            const track_options: APISelectMenuOption[] = tracks
                .slice(0, 25)
                .map((track, index) => {
                    return {
                        label: truncateText(track.title),
                        description: track.author
                            ? truncateText(track.author)
                            : undefined,
                        value: index.toString(),
                    };
                });

            await interaction.followUp({
                embeds: [
                    {
                        title: `${tracks.length}件の結果が見つかりました`,
                        description: '25件以上の結果は省略されています',
                        color: Colors.Yellow,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.StringSelect,
                                customId: 'track_select',
                                placeholder: '楽曲を選択してください',
                                options: track_options,
                            },
                        ],
                    },
                ],
            });

            const msg = await interaction.fetchReply();
            const filter = (i: MessageComponentInteraction) =>
                i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                time: 60000,
            });

            collector.on('collect', async (i) => {
                if (!i.isStringSelectMenu()) return;
                if (!interaction.guild) return;

                const selected_option = i.values[0];

                const track = tracks[parseInt(selected_option)];

                let queue = useQueue(interaction.guild);

                if (!queue) {
                    queue = player.queues.create(interaction.guild, {
                        metadata: interaction.channel,
                    });
                }

                if (!queue.connection) {
                    await queue.connect(channel);
                }

                queue.addTrack(track);

                if (!queue.isPlaying()) {
                    queue.node.setVolume(35);
                    await queue.node.play();
                    return await interaction.editReply({
                        embeds: [
                            {
                                title: '🎵 再生中 🎵',
                                description: `[${track.title}](${track.url}) - ${track.author}`,
                                image: {
                                    url: track.thumbnail,
                                },
                                color: Colors.Blue,
                                footer: client.footer(),
                            },
                        ],
                        components: [],
                    });
                }

                await interaction.editReply({
                    embeds: [
                        {
                            description: `[${track.title}](${track.url})をキューに追加しました`,
                            thumbnail: {
                                url: track.thumbnail,
                            },
                            color: Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                    components: [],
                });
            });

            collector.on('end', async () => {
                await interaction.editReply({
                    components: [],
                });
            });
        },
    },
});
