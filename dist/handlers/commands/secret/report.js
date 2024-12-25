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
    name: 'report',
    isOwnerCommand: true,
    description: 'report',
    options: [
        {
            name: 'user',
            description: 'ユーザーを通報します',
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'ユーザー',
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: true,
                },
                // {
                //   name: 'threads',
                //   description: 'スレッド数',
                //   type: ApplicationCommandOptionType.Integer,
                //   choices: [{ name: "1", value: 1 }]
                // }
            ],
        },
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const cmd = interaction.options.getSubcommand();
            const ct = new CoolTime(interaction.user.id);
            const cooldown = ct.getCoolTime(1000 * 60 * 60 * 3);
            if (cooldown) {
                const next = ct.getNextAvailableTime(1000 * 60 * 60 * 3);
                if (!next)
                    return;
                return yield interaction.followUp({
                    embeds: [
                        {
                            title: 'エラーが発生しました',
                            description: '3時間に1回のみコマンドを実行することができます。\n' +
                                `次は<t:${next}:R>に実行できます`,
                            color: discord_js_1.Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }
            if (cmd === 'user') {
                const user = interaction.options.getUser('user', true);
                yield interaction.followUp({
                    embeds: [
                        {
                            title: 'ユーザーを通報',
                            description: `${user.displayName}(${user.tag})を通報します\n` +
                                '**Target:**\n' +
                                `  - **Name:** ${user.username}\n` +
                                `  - **ID:** ${user.id}\n` +
                                '**Status:**\n' +
                                '  - **Threads:** 1/1\n' +
                                '  - **Request:** 0/6000',
                            color: discord_js_1.Colors.Blue,
                            footer: client.footer(),
                        },
                    ],
                });
                let sum = 0;
                const target = 6000;
                while (sum !== target) {
                    const delay = Math.floor(Math.random() * 1800) + 1200;
                    const addend = Math.floor(Math.random() * 320) + 220;
                    if (sum + addend > target) {
                        sum = 6000;
                        continue;
                    }
                    sum += addend;
                    yield interaction.editReply({
                        embeds: [
                            {
                                title: 'ユーザーを通報',
                                description: `${user.displayName}(${user.tag})を通報します\n` +
                                    '**Target:**\n' +
                                    ` - **Name:** ${user.username}\n` +
                                    ` - **ID:** ${user.id}\n` +
                                    '- Status:\n' +
                                    ' - Threads: 1/1\n' +
                                    ` - Request: ${sum}/6000`,
                                color: discord_js_1.Colors.Blue,
                                footer: client.footer(),
                            },
                        ],
                    });
                    yield new Promise((resolve) => setTimeout(resolve, delay));
                }
                yield interaction.editReply({
                    embeds: [
                        {
                            title: '✅ 通報が完了しました',
                            description: '**リクエストした回数:** 6000\n' +
                                `**成功した回数:** ${Math.floor(Math.random() * (3000 - 600 + 1)) + 600}\n` +
                                `**予測成功確率:** ${(Math.random() * (42.0 - 0.2) + 0.2).toFixed(2)}%`,
                            color: discord_js_1.Colors.Green,
                            footer: client.footer(),
                        },
                    ],
                });
                ct.setCoolTime();
            }
        }),
    },
});
