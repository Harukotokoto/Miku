import { Miku } from '@/libraries/Classes/Miku';
import {
    APISelectMenuOption,
    ChatInputCommandInteraction,
    Colors,
    ComponentType,
    MessageComponentInteraction,
} from 'discord.js';
import { player } from '@/index';
import { truncateText } from '@/libraries/Functions/truncateText';
import { QueryType } from 'discord-player';

export async function play({
    client,
    interaction,
}: {
    client: Miku;
    interaction: ChatInputCommandInteraction;
}) {
    if (!interaction.guild) return;

    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member) return;

    const channel = member.voice.channel;
    if (!channel)
        return interaction.followUp({
            embeds: [
                {
                    description: 'まずはボイスチャットに参加する必要があります',
                    color: Colors.Red,
                    footer: client.footer(),
                },
            ],
        });

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

        const queue = player.queues.create(interaction.guild, {
            metadata: interaction.channel,
        });

        if (!queue.connection) {
            await queue.connect(channel);
        }

        queue.addTrack(track);

        await queue.node.play();

        await interaction.editReply({
            embeds: [
                {
                    title: `**${track.title}**を再生します`,
                    image: {
                        url: track.thumbnail,
                    },
                    color: Colors.Blue,
                    footer: client.footer(),
                    author: {
                        name: track.author,
                    },
                },
            ],
            components: [],
        });
    });
}
