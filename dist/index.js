"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.client = void 0;
const Miku_1 = require("./libraries/Classes/Miku");
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const discord_player_youtubei_1 = require("discord-player-youtubei");
exports.client = new Miku_1.Miku({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.GuildVoiceStates,
    ],
    allowedMentions: {
        repliedUser: false,
    },
    debugMode: false,
    admins: [
        '1004365048887660655',
        '957885295251034112',
        '1301893603328786464',
    ],
    prefix: 'm.',
});
exports.player = new discord_player_1.Player(exports.client);
exports.player.extractors.register(discord_player_youtubei_1.YoutubeiExtractor, {});
// player.events.on('playerError', async (queue, error) => {
//     if (!queue.metadata) {
//         return client.logger.error(error.stack || error.message);
//     }
//     await queue.metadata.send({
//         embeds: [
//             {
//                 title: '再生中にエラーが発生しました',
//                 description: `\`\`\`\n${error.message}\n\`\`\``,
//                 color: Colors.Red,
//                 footer: client.footer(),
//             },
//         ],
//     });
// });
// process.on('unhandledRejection', (err) => {
//     client.logger.error(err as string);
// });
//
// process.on('uncaughtException', (err) => {
//     client.logger.error(err.message);
// });
exports.client.run();
