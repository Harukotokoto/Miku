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
const MakeItAQuote_1 = require("../../../libraries/Classes/Modules/MakeItAQuote");
exports.default = new Command_1.Command({
    name: 'Make it a Quote',
    type: discord_js_1.ApplicationCommandType.Message,
    contexts: [
        discord_js_1.InteractionContextType.PrivateChannel,
        discord_js_1.InteractionContextType.BotDM,
        discord_js_1.InteractionContextType.Guild,
    ],
    integrationTypes: [discord_js_1.ApplicationIntegrationType.UserInstall],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            var _b;
            const message = interaction.targetMessage;
            const miq = new MakeItAQuote_1.MakeItAQuote()
                .setText(message.cleanContent)
                .setUsername(message.author.tag)
                .setDisplayName(message.author.displayName)
                .setAvatarURL(message.author.displayAvatarURL({ size: 1024 }))
                .setWatermark(((_b = client.user) === null || _b === void 0 ? void 0 : _b.tag) || '');
            const quote = yield miq.build();
            yield interaction.followUp({
                content: `[生成元のメッセージ](<${message.url}>)`,
                files: [
                    {
                        attachment: quote,
                        name: 'quote.jpg',
                    },
                ],
            });
        }),
    },
});
