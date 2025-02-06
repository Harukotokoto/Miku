import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    ButtonStyle,
    Colors,
    ComponentType,
    InteractionContextType,
} from 'discord.js';
import crypto from 'crypto';

export default new Command({
    name: 'crypto',
    description: 'メッセージを暗号化します',
    userInstall: true,
    options: [
        {
            name: 'encode',
            description: '文字列を暗号化します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'message',
                    description: '暗号化するメッセージ',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'decode',
            description: '照合キーを使用して暗号化を解除します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'hash',
                    description: 'デコードするハッシュ値',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'key',
                    description: '照合キー',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const cmd = interaction.options.getSubcommand();

            if (cmd === 'encode') {
                const message = interaction.options.getString('message', true);

                const key = crypto.randomUUID();
                const algorithm = 'aes-256-ecb';
                const keyBuffer = crypto
                    .createHash('sha256')
                    .update(key)
                    .digest();

                const cipher = crypto.createCipheriv(
                    algorithm,
                    keyBuffer,
                    null,
                );
                let encrypted = cipher.update(message, 'utf8', 'hex');
                encrypted += cipher.final('hex');

                await interaction.followUp({
                    embeds: [
                        {
                            description:
                                '暗号化が完了しました\n\n' +
                                `**ハッシュ値:** ${encrypted}\n` +
                                `**照合キー:** ${key}\n`,
                            color: Colors.Purple,
                            footer: client.footer(),
                        },
                    ],
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    label: 'ハッシュ値をコピー',
                                    style: ButtonStyle.Secondary,
                                    customId: 'copy_hash',
                                },
                                {
                                    type: ComponentType.Button,
                                    label: '照合キーをコピー',
                                    style: ButtonStyle.Secondary,
                                    customId: 'copy_key',
                                },
                            ],
                        },
                    ],
                });

                const repliedMsg = await interaction.fetchReply();

                const collector = repliedMsg.createMessageComponentCollector({
                    time: 60 * 1000,
                    filter: (i) => i.id !== interaction.user.id,
                });

                collector.on('collect', (i) => {
                    if (!i.isButton()) return;
                    if (i.customId === 'copy_hash') {
                        i.reply({
                            content: encrypted.toString(),
                            embeds: [
                                {
                                    description:
                                        'ハッシュ値を出力しました。\n' +
                                        'このメッセージをコピーしてください',
                                    color: Colors.Yellow,
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
                                    description:
                                        '照合キーを出力しました。\n' +
                                        'このメッセージをコピーしてください',
                                    color: Colors.Yellow,
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
                const keyBuffer = crypto
                    .createHash('sha256')
                    .update(key)
                    .digest();

                const decipher = crypto.createDecipheriv(
                    algorithm,
                    keyBuffer,
                    null,
                );
                let decrypted = decipher.update(hash, 'hex', 'utf8');
                decrypted += decipher.final('utf8');

                await interaction.followUp({
                    embeds: [
                        {
                            title: '複合化しました',
                            description: decrypted.toString(),
                            color: Colors.Purple,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
    },
});
