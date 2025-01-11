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
    name: 'oneclick',
    description: 'ワンクリック認証を設定します',
    options: [
        {
            name: 'setup',
            description: 'ワンクリック認証を設定します',
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: '認証完了時に付与するロール',
                    type: discord_js_1.ApplicationCommandOptionType.Role,
                    required: true,
                },
                {
                    name: 'title',
                    description: 'タイトル',
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    maxLength: 32,
                    minLength: 1,
                },
                {
                    name: 'description',
                    description: '説明 (%nで改行できます)',
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    maxLength: 1024,
                    minLength: 1,
                },
            ],
        },
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            var _b;
            const role = interaction.options.getRole('role', true);
            const title = interaction.options.getString('title') || 'ワンクリック認証';
            const description = ((_b = interaction.options
                .getString('description')) === null || _b === void 0 ? void 0 : _b.replace('%n', '\n')) ||
                'ボタンを押して認証します\n' +
                    `認証完了後、${role}が付与されます`;
            yield interaction.followUp({
                embeds: [
                    {
                        title: title,
                        description: description,
                        color: discord_js_1.Colors.Blue,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: discord_js_1.ComponentType.ActionRow,
                        components: [
                            {
                                type: discord_js_1.ComponentType.Button,
                                label: '認証',
                                emoji: '✅',
                                customId: `oneclick-${role.id}`,
                                style: discord_js_1.ButtonStyle.Success,
                            },
                        ],
                    },
                ],
            });
        }),
    },
});
