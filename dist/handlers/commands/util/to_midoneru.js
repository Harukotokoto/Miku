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
    name: 'みどねるをタイムアウト',
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
            var _b;
            const user = interaction.targetUser;
            const member = yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(user.id));
            if (!member)
                return;
            const midoneru_accounts = ['1155331881932439633'];
            if (!midoneru_accounts.includes(member.id)) {
                return yield interaction.followUp({
                    embeds: [
                        {
                            title: 'エラーが発生しました',
                            description: 'みどねるのみタイムアウトすることができます',
                            color: discord_js_1.Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }
            yield member.timeout(60 * 10);
            yield interaction.followUp({
                embeds: [
                    {
                        title: `みどねるをタイムアウトしました`,
                        description: 'このコマンドは誰でも使用することができます',
                        color: discord_js_1.Colors.Yellow,
                        footer: client.footer(),
                    },
                ],
            });
        }),
    },
});
