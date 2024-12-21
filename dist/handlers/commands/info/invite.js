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
const CommandError_1 = require("../../../libraries/Classes/Handlers/CommandError");
exports.default = new Command_1.Command({
    name: 'invite',
    description: 'Botの招待リンクを表示します',
    options: [
        {
            name: 'bot',
            description: '招待リンクを表示するBot',
            type: discord_js_1.ApplicationCommandOptionType.User,
        },
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            var _b, _c;
            if (!interaction.guild)
                return;
            const userId = ((_b = interaction.options.getUser('bot')) === null || _b === void 0 ? void 0 : _b.id) || ((_c = client.user) === null || _c === void 0 ? void 0 : _c.id);
            const member = interaction.guild.members.cache.get(userId);
            const error = new CommandError_1.CommandError(interaction);
            if (!member)
                return yield error.create('指定されたユーザーはサーバー内に存在しません');
            if (!member.user.bot)
                return yield error.create('Botを指定する必要があります');
            const baseUrl = 'https://discord.com/oauth2/authorize';
            const url = new URL(baseUrl);
            url.searchParams.set('client_id', member.id);
            url.searchParams.set('permissions', '8');
            url.searchParams.set('integration_type', '0');
            url.searchParams.set('scope', 'bot applications.commands');
            yield interaction.followUp({
                embeds: [
                    {
                        description: interaction.options.getUser('bot')
                            ? `[クリックして招待](<${url.toString()}>)`
                            : `[クリックして招待](<${url.toString()}>)\n[ユーザーインストール](<https://discord.com/oauth2/authorize?client_id=1318492572858974268&integration_type=1&scope=applications.commands>)`,
                        color: discord_js_1.Colors.Yellow,
                        footer: client.footer(),
                    },
                ],
            });
        }),
    },
});
