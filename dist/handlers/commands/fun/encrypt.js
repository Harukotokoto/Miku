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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../../libraries/Classes/Handlers/Command");
const discord_js_1 = require("discord.js");
const crypto_1 = __importDefault(require("crypto"));
exports.default = new Command_1.Command({
    name: 'crypto',
    description: 'メッセージを暗号化します',
    ephemeral: true,
    contexts: [
        discord_js_1.InteractionContextType.PrivateChannel,
        discord_js_1.InteractionContextType.Guild,
        discord_js_1.InteractionContextType.BotDM,
    ],
    integrationTypes: [
        discord_js_1.ApplicationIntegrationType.UserInstall,
        discord_js_1.ApplicationIntegrationType.GuildInstall,
    ],
    options: [
        {
            name: 'encode',
            description: '文字列を暗号化します',
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'message',
                    description: '暗号化するメッセージ',
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'decode',
            description: '照合キーを使用して暗号化を解除します',
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'hash',
                    description: 'デコードするハッシュ値',
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'key',
                    description: '照合キー',
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const cmd = interaction.options.getSubcommand();
            if (cmd === 'encode') {
                const message = interaction.options.getString('message', true);
                const key = crypto_1.default.randomUUID();
                const algorithm = 'aes-256-ecb';
                const keyBuffer = crypto_1.default.createHash('sha256').update(key).digest();
                const cipher = crypto_1.default.createCipheriv(algorithm, keyBuffer, null);
                let encrypted = cipher.update(message, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                yield interaction.followUp({
                    embeds: [
                        {
                            description: '暗号化が完了しました\n\n' +
                                `**ハッシュ値:** ${encrypted}\n` +
                                `**照合キー:** ${key}\n`,
                            color: discord_js_1.Colors.Purple,
                            footer: client.footer(),
                        },
                    ],
                    components: [
                        {
                            type: discord_js_1.ComponentType.ActionRow,
                            components: [
                                {
                                    type: discord_js_1.ComponentType.Button,
                                    label: 'ハッシュ値をコピー',
                                    style: discord_js_1.ButtonStyle.Secondary,
                                    customId: 'copy_hash',
                                },
                                {
                                    type: discord_js_1.ComponentType.Button,
                                    label: '照合キーをコピー',
                                    style: discord_js_1.ButtonStyle.Secondary,
                                    customId: 'copy_key',
                                },
                            ],
                        },
                    ],
                });
                const repliedMsg = yield interaction.fetchReply();
                const collector = repliedMsg.createMessageComponentCollector({
                    time: 60 * 1000,
                    filter: (i) => i.id !== interaction.user.id,
                });
                collector.on('collect', (i) => {
                    if (!i.isButton())
                        return;
                    if (i.customId === 'copy_hash') {
                        i.reply({
                            content: encrypted.toString(),
                            embeds: [
                                {
                                    description: 'ハッシュ値を出力しました。\n' +
                                        'このメッセージをコピーしてください',
                                    color: discord_js_1.Colors.Yellow,
                                    footer: client.footer(),
                                },
                            ],
                            ephemeral: true,
                        });
                    }
                    if (i.customId === 'copy_key') {
                        i.reply({
                            content: key.toString(),
                            embeds: [
                                {
                                    description: '照合キーを出力しました。\n' +
                                        'このメッセージをコピーしてください',
                                    color: discord_js_1.Colors.Yellow,
                                    footer: client.footer(),
                                },
                            ],
                            ephemeral: true,
                        });
                    }
                });
            }
            if (cmd === 'decode') {
                const hash = interaction.options.getString('hash', true);
                const key = interaction.options.getString('key', true);
                const algorithm = 'aes-256-ecb';
                const keyBuffer = crypto_1.default.createHash('sha256').update(key).digest();
                const decipher = crypto_1.default.createDecipheriv(algorithm, keyBuffer, null);
                let decrypted = decipher.update(hash, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                yield interaction.followUp({
                    embeds: [
                        {
                            title: '複合化しました',
                            description: decrypted.toString(),
                        },
                    ],
                });
            }
        }),
    },
});
