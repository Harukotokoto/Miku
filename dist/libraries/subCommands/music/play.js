"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.play = play;
const discord_js_1 = require("discord.js");
const index_1 = require("../../../index");
const truncateText_1 = require("../../Functions/truncateText");
const discord_player_1 = require("discord-player");
function play(_a) {
    return __awaiter(this, arguments, void 0, function* ({ client, interaction, }) {
        if (!interaction.guild)
            return;
        const member = yield interaction.guild.members.fetch(interaction.user.id);
        if (!member)
            return;
        const channel = member.voice.channel;
        if (!channel)
            return interaction.followUp({
                embeds: [
                    {
                        description: 'まずはボイスチャットに参加する必要があります',
                        color: discord_js_1.Colors.Red,
                        footer: client.footer(),
                    },
                ],
            });
        const query = interaction.options.getString('query', true);
        const searchResult = yield index_1.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: discord_player_1.QueryType.AUTO,
        });
        if (!searchResult || !searchResult.tracks.length) {
            return yield interaction.followUp({
                embeds: [
                    {
                        description: '検索結果がありませんでした',
                        color: discord_js_1.Colors.Red,
                        footer: client.footer(),
                    },
                ],
            });
        }
        const tracks = searchResult.tracks;
        const track_options = tracks
            .slice(0, 25)
            .map((track, index) => {
            return {
                label: (0, truncateText_1.truncateText)(track.title),
                description: track.author
                    ? (0, truncateText_1.truncateText)(track.author)
                    : undefined,
                value: index.toString(),
            };
        });
        yield interaction.followUp({
            embeds: [
                {
                    title: `${tracks.length}件の結果が見つかりました`,
                    description: '25件以上の結果は省略されています',
                    color: discord_js_1.Colors.Yellow,
                    footer: client.footer(),
                },
            ],
            components: [
                {
                    type: discord_js_1.ComponentType.ActionRow,
                    components: [
                        {
                            type: discord_js_1.ComponentType.StringSelect,
                            customId: 'track_select',
                            placeholder: '楽曲を選択してください',
                            options: track_options,
                        },
                    ],
                },
            ],
        });
        const msg = yield interaction.fetchReply();
        const filter = (i) => i.user.id === interaction.user.id;
        const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000,
        });
        collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
            if (!i.isStringSelectMenu())
                return;
            if (!interaction.guild)
                return;
            const selected_option = i.values[0];
            const track = tracks[parseInt(selected_option)];
            const queue = index_1.player.queues.create(interaction.guild, {
                metadata: interaction.channel,
            });
            if (!queue.connection) {
                yield queue.connect(channel);
            }
            queue.addTrack(track);
            yield queue.node.play();
            yield interaction.editReply({
                embeds: [
                    {
                        title: `**${track.title}**を再生します`,
                        thumbnail: {
                            url: track.thumbnail,
                        },
                        color: discord_js_1.Colors.Blue,
                        footer: client.footer(),
                        author: {
                            name: track.author,
                        },
                    },
                ],
                components: [],
            });
        }));
        // return interaction.followUp({
        //     embeds: [
        //         {
        //             title: '楽曲が追加されました',
        //             description: track.title,
        //             image: {
        //                 url: track.thumbnail
        //             },
        //             color: Colors.Blue
        //         }
        //     ]
        // });
    });
}
