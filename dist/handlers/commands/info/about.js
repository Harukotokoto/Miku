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
const Command_1 = require("../../../libraries/Classes/Handlers/Command");
const discord_js_1 = require("discord.js");
exports.default = new Command_1.Command({
    name: 'about',
    description: 'Mikuに関する情報を表示します',
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            yield interaction.followUp({
                embeds: [
                    {
                        title: 'Mikuについて',
                        fields: [
                            {
                                name: '開発者',
                                value: 'Harukoto([@harukoto_vlrnt](<https://x.com/harukoto_vlrnt>)',
                                inline: true,
                            },
                            {
                                name: '言語',
                                value: '`Node.js v22.12.0`,`discord.js@14.16.3`',
                                inline: true,
                            },
                            {
                                name: '公式サーバー(**準備中です。仮のサーバーです**)',
                                value: 'https://discord.gg/hima',
                                inline: true,
                            },
                            {
                                name: 'サーバー数',
                                value: `${client.guilds.cache.size}サーバー`,
                                inline: true,
                            },
                            {
                                name: 'ユーザー数',
                                value: `${client.guilds.cache.filter((guild) => guild.available).reduce((num, guild) => num + guild.memberCount, 0)}人`,
                                inline: true,
                            },
                        ],
                        url: 'https://miku.harukoto.jp',
                        color: discord_js_1.Colors.Blurple,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: discord_js_1.ComponentType.ActionRow,
                        components: [
                            {
                                type: discord_js_1.ComponentType.Button,
                                label: '利用規約',
                                style: discord_js_1.ButtonStyle.Link,
                                url: 'https://miku.harukoto.jp/tos',
                            },
                            {
                                type: discord_js_1.ComponentType.Button,
                                label: 'プライバシーポリシー',
                                style: discord_js_1.ButtonStyle.Link,
                                url: 'https://miku.harukoto.jp/privacy-policy',
                            },
                            {
                                type: discord_js_1.ComponentType.Button,
                                label: 'ソースコード',
                                style: discord_js_1.ButtonStyle.Link,
                                url: 'https://miku.harukoto.jp/src',
                            },
                        ],
                    },
                ],
            });
        }),
    },
});
