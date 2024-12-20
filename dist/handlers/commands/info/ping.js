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
    name: 'ping',
    description: 'BotにPingを送信します',
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const ping = client.ws.ping;
            yield interaction.followUp({
                embeds: [
                    {
                        title: '🏓 Pong!',
                        description: 'Botは正常に起動しています！\n' +
                            '\n' +
                            `**Ping:** ${ping}ms\n` +
                            `**Prefix:** ${client.prefix}`,
                        color: discord_js_1.Colors.Green,
                        footer: client.footer(),
                    },
                ],
            });
        }),
        message: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, message, args }) {
            const ping = client.ws.ping;
            yield message.reply({
                embeds: [
                    {
                        title: '🏓 Pong!',
                        description: 'Botは正常に起動しています！\n' +
                            '\n' +
                            `**Ping:** ${ping}ms\n` +
                            `**Prefix:** ${client.prefix}`,
                        color: discord_js_1.Colors.Green,
                        footer: client.footer(),
                    },
                ],
            });
        }),
    },
});
