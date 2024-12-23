"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const Miku_1 = require("./libraries/Classes/Miku");
const discord_js_1 = require("discord.js");
exports.client = new Miku_1.Miku({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
    ],
    allowedMentions: {
        repliedUser: false,
    },
    debugMode: true,
    admins: ['1004365048887660655', '957885295251034112'],
    prefix: 'm.',
});
// process.on('unhandledRejection', (err) => {
//   client.logger.error(err as string);
// });
// process.on('uncaughtException', (err) => {
//   client.logger.error(err.message);
// });
exports.client.run();
