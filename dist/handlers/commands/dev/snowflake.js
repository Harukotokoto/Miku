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
    name: 'snowflake',
    description: 'Snowflakeを解析し、情報を出力します',
    options: [
        {
            type: discord_js_1.ApplicationCommandOptionType.String,
            name: 'snowflake',
            description: '内部ID',
            required: true,
        },
    ],
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
            const snowflake = interaction.options.getString('snowflake', true);
            const data = discord_js_1.SnowflakeUtil.deconstruct(snowflake);
            const id = data.id;
            const timestamp = data.timestamp / BigInt(1000);
            const workerId = data.workerId;
            const processId = data.processId;
            const increment = data.increment;
            const epoch = data.epoch;
            yield interaction.followUp({
                embeds: [
                    {
                        title: `Snowflake: ${snowflake} の情報`,
                        description: `**Snowflake:** ${id}\n` +
                            `**作成日:** <t:${timestamp}:F>\n` +
                            `**Worker ID:** ${workerId}\n` +
                            `**Process ID:** ${processId}\n` +
                            `**Increment:** ${increment}\n` +
                            `**Epoch:** ${epoch}`,
                        color: discord_js_1.Colors.Purple,
                        footer: client.footer(),
                    },
                ],
            });
        }),
    },
});
