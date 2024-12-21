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
    name: 'ユーザーのアバターを取得',
    type: discord_js_1.ApplicationCommandType.User,
    contexts: [
        discord_js_1.InteractionContextType.PrivateChannel,
        discord_js_1.InteractionContextType.BotDM,
        discord_js_1.InteractionContextType.Guild,
    ],
    integrationTypes: [
        discord_js_1.ApplicationIntegrationType.UserInstall,
        discord_js_1.ApplicationIntegrationType.GuildInstall,
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const user = interaction.targetUser;
            yield interaction.followUp({
                embeds: [
                    {
                        title: `${user.displayName} (${user.tag})のアバター`,
                        image: {
                            url: user.avatarURL({ size: 1024, extension: 'png' }) ||
                                user.defaultAvatarURL,
                        },
                        color: discord_js_1.Colors.Yellow,
                        footer: client.footer(),
                    },
                ],
            });
        }),
    },
});
