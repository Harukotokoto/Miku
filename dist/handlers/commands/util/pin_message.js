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
const discord_js_1 = require("discord.js");
const Command_1 = require("../../../libraries/Classes/Handlers/Command");
const pin_message_1 = require("../../../libraries/Models/pin_message");
exports.default = new Command_1.Command({
    name: 'メッセージを固定/解除',
    requiredPermissions: ['ManageMessages'],
    ephemeral: true,
    type: discord_js_1.ApplicationCommandType.Message,
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            var _b, _c, _d, _e, _f, _g;
            const message = interaction.targetMessage;
            const pin_data = yield pin_message_1.pin_model.findOne({
                ChannelID: (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id,
            });
            if (!pin_data) {
                if (!message.content) {
                    yield interaction.followUp({
                        embeds: [
                            {
                                title: 'メッセージを固定できませんでした',
                                description: 'メッセージの内容がありません(埋め込みを固定することはできません)',
                                color: discord_js_1.Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                    });
                    return;
                }
                if (!((_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.isSendable()))
                    return;
                const msg = yield interaction.channel.send({
                    embeds: [
                        {
                            description: message.content,
                            color: discord_js_1.Colors.Gold,
                            author: {
                                name: message.author.displayName,
                                icon_url: message.author.displayAvatarURL(),
                            },
                        },
                    ],
                });
                yield pin_message_1.pin_model.create({
                    GuildID: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
                    ChannelID: (_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.id,
                    MessageID: message.id,
                    LastMessageID: msg === null || msg === void 0 ? void 0 : msg.id,
                });
                client.addPinnedChannels((_f = interaction.channel) === null || _f === void 0 ? void 0 : _f.id);
                yield interaction.followUp({
                    embeds: [
                        {
                            description: 'メッセージを固定しました',
                            color: discord_js_1.Colors.Green,
                            footer: client.footer(),
                        },
                    ],
                });
            }
            else {
                yield pin_message_1.pin_model.deleteOne({ ChannelID: message.channel.id });
                client.removePinnedChannels((_g = interaction.channel) === null || _g === void 0 ? void 0 : _g.id);
                yield interaction.followUp({
                    embeds: [
                        {
                            title: 'メッセージの固定を解除しました',
                            footer: {
                                text: '既に固定されているメッセージがある場合は解除されます',
                            },
                            color: discord_js_1.Colors.Red,
                        },
                    ],
                });
            }
        }),
    },
});
