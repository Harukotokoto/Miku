import { Command } from '@/handlers/Command';
import {
    APIEmbed,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Colors,
} from 'discord.js';
import { Snipe } from '@/modules/Snipe';

export default new Command({
    name: 'snipe',
    description:
        '編集/削除されたメッセージを取得し、表示します。パラメーターに"e"を含むと編集したメッセージを表示します',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'snipe_type',
            description: 'Snipe Type',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'Delete', value: 'd' },
                { name: 'Edit', value: 'e' },
            ],
        },
    ],
    aliases: ['s'],
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.isChatInputCommand()) return;
            const args = interaction.options.getString('snipe_type');
            const argument = args || 'd';

            if (!interaction.channel) return;

            const snipe = new Snipe(interaction.channel);

            if (argument !== 'e') {
                const sniped_message = snipe.getMessage('edit');
                if (!sniped_message) {
                    await interaction.followUp({
                        embeds: [
                            {
                                description:
                                    'スナイプするメッセージがありません',
                                color: Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                        allowedMentions: {
                            parse: [],
                        },
                    });

                    return;
                }

                const attachments = sniped_message.message.attachments?.size
                    ? sniped_message.message.attachments.map(
                          (attachment) => attachment.proxyURL,
                      )
                    : undefined;

                const embeds: APIEmbed[] = [
                    {
                        author: {
                            name: `${
                                sniped_message.message.author?.displayName || ''
                            }(${sniped_message.message.author?.tag})`,
                            icon_url:
                                sniped_message.message.author
                                    ?.avatarURL()
                                    ?.toString() || '',
                        },
                        description: `${sniped_message.message.content}`,
                        timestamp: new Date(
                            sniped_message.message.createdTimestamp,
                        ).toISOString(),
                        color: Colors.Blue,
                        image: {
                            url: `https://25dsnipe.com/${sniped_message.message.author?.id}`,
                        },
                    },
                ];

                attachments?.forEach((attachment) => {
                    embeds.push({
                        image: {
                            url: attachment,
                        },
                        color: Colors.Blue,
                    });
                });

                await interaction.followUp({
                    embeds: embeds,
                    allowedMentions: {
                        parse: [],
                    },
                });

                return;
            } else {
                const sniped_message = snipe.getMessage('delete');
                if (!sniped_message || !sniped_message.newMessage) {
                    await interaction.reply({
                        embeds: [
                            {
                                description:
                                    'スナイプするメッセージがありません',
                                color: Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                        allowedMentions: {
                            parse: [],
                        },
                    });

                    return;
                }

                await interaction.followUp({
                    embeds: [
                        {
                            author: {
                                name: `${sniped_message.newMessage.author?.displayName || ''}(${
                                    sniped_message.newMessage.author?.tag
                                })`,
                                icon_url:
                                    sniped_message.newMessage.author
                                        ?.avatarURL()
                                        ?.toString() || '',
                            },
                            description: `${sniped_message.message.content} => ${sniped_message.newMessage.content}`,
                            timestamp: new Date(
                                sniped_message.newMessage.createdTimestamp,
                            ).toISOString(),
                            color: Colors.Blue,
                            image: {
                                url: `https://25dsnipe.com/${sniped_message.newMessage.author?.id}`,
                            },
                        },
                    ],
                    allowedMentions: {
                        parse: [],
                    },
                });
            }
        },
        message: async ({ client, message, args }) => {
            const argument = args[0] ? (args[0] === 'e' ? 'e' : 'd') : 'd';

            const snipe = new Snipe(message.channel);

            if (argument !== 'e') {
                const sniped_message = snipe.getMessage('delete');
                if (!sniped_message) {
                    await message.reply({
                        embeds: [
                            {
                                description:
                                    'スナイプするメッセージがありません',
                                color: Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                        allowedMentions: {
                            parse: [],
                        },
                    });

                    return;
                }

                const attachments = sniped_message.message.attachments.size
                    ? sniped_message.message.attachments.map(
                          (attachment) => attachment.proxyURL,
                      )
                    : undefined;

                const embeds: APIEmbed[] = [
                    {
                        author: {
                            name: `${
                                sniped_message.message.author?.displayName || ''
                            }(${sniped_message.message.author?.tag})`,
                            icon_url:
                                sniped_message.message.author
                                    ?.avatarURL()
                                    ?.toString() || '',
                        },
                        description: `${sniped_message.message.content}`,
                        timestamp: new Date(
                            sniped_message.message.createdTimestamp,
                        ).toISOString(),
                        color: Colors.Blue,
                        image: {
                            url: `https://25dsnipe.com/${sniped_message.message.author?.id}`,
                        },
                    },
                ];

                attachments?.forEach((attachment) => {
                    embeds.push({
                        image: {
                            url: attachment,
                        },
                        color: Colors.Blue,
                    });
                });

                await message.reply({
                    embeds: embeds,
                    allowedMentions: {
                        parse: [],
                    },
                });

                return;
            } else {
                const sniped_message = snipe.getMessage('edit');
                if (!sniped_message || !sniped_message.newMessage) {
                    await message.reply({
                        embeds: [
                            {
                                description:
                                    'スナイプするメッセージがありません',
                                color: Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                        allowedMentions: {
                            parse: [],
                        },
                    });

                    return;
                }

                await message.reply({
                    embeds: [
                        {
                            author: {
                                name: `${sniped_message.newMessage.author?.displayName || ''}(${
                                    sniped_message.newMessage.author?.tag
                                })`,
                                icon_url:
                                    sniped_message.newMessage.author
                                        ?.avatarURL()
                                        ?.toString() || '',
                            },
                            description: `${sniped_message.message.content} => ${sniped_message.newMessage.content}`,
                            timestamp: new Date(
                                sniped_message.newMessage.createdTimestamp,
                            ).toISOString(),
                            color: Colors.Blue,
                            image: {
                                url: `https://25dsnipe.com/${sniped_message.newMessage.author?.id}`,
                            },
                        },
                    ],
                    allowedMentions: {
                        parse: [],
                    },
                });
            }
        },
    },
});
