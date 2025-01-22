import { TicketSetupOptions } from '@/interfaces/TicketSetupOptions';
import ticket from '@/models/Ticket';
import { randomUUID } from 'crypto';
import {
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    Colors,
    ComponentType,
    ModalSubmitInteraction,
    OverwriteType,
    PermissionsBitField,
} from 'discord.js';
import { client } from '@/index';

export class Ticket {
    public interaction: ButtonInteraction;

    public constructor(interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    public static async setup(options: TicketSetupOptions) {
        return await ticket.create({
            ...options,
            ticketId: randomUUID(),
        });
    }

    public static async create(interaction: ModalSubmitInteraction) {
        if (!interaction.guild)
            throw new Error('サーバー内でのみ実行することができます');

        const topic = interaction.fields.getTextInputValue('topic');
        const issue = interaction.fields.getTextInputValue('issue');

        const messageId = interaction.customId.split(/-/g)[1];

        const ticketData = await ticket.findOne({
            messageId: messageId,
        });

        if (!ticketData) throw new Error('チケットが見つかりませんでした');

        const staffRole = interaction.guild.roles.cache.get(
            ticketData.staffRoleId,
        );

        if (!staffRole) throw new Error('スタッフロールが見つかりませんでした');

        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: ticketData.parentId,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: staffRole.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        await channel.send({
            content: staffRole.toString(),
            embeds: [
                {
                    title: 'チケットを作成しました',
                    description:
                        '```\nチケットを作成しました\nスタッフの対応までお待ちください\n```',
                    fields: [
                        {
                            name: '発行者',
                            value: interaction.user.toString(),
                        },
                        {
                            name: 'タイトル',
                            value: topic,
                        },
                        {
                            name: '問題',
                            value: issue,
                        },
                    ],
                    footer: client.footer(),
                    color: Colors.Blue,
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: 'チケットを閉じる',
                            customId: 'ticket_close',
                            style: ButtonStyle.Secondary,
                        },
                    ],
                },
            ],
            allowedMentions: {
                parse: ['roles'],
            },
        });

        return channel.id;
    }

    public async close() {
        if (!this.interaction.channel)
            throw new Error('サーバー内でのみ実行することができます');
        if (!this.interaction.guild)
            throw new Error('サーバー内でのみ実行することができます');

        if (this.interaction.channel.isDMBased())
            throw new Error('サーバー内でのみ実行することができます');
        if (this.interaction.channel.isThread())
            throw new Error('スレッド内で実行することはできません');

        const channelPermissions = [
            ...this.interaction.channel.permissionOverwrites.cache.values(),
        ];

        for (const permission of channelPermissions) {
            if (permission.type === OverwriteType.Role) continue;

            await permission.edit({
                ViewChannel: false,
            });
        }

        await this.interaction.channel.send({
            embeds: [
                {
                    title: 'チケットを閉じました',
                    color: Colors.Grey,
                    footer: client.footer(),
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: '再度開く',
                            customId: 'reopen-ticket',
                            style: ButtonStyle.Secondary,
                        },
                        {
                            type: ComponentType.Button,
                            label: 'ログを書き出し',
                            customId: 'write-logs',
                            style: ButtonStyle.Primary,
                        },
                        {
                            type: ComponentType.Button,
                            label: 'チケットを削除',
                            customId: 'delete-ticket',
                            style: ButtonStyle.Danger,
                        },
                    ],
                },
            ],
        });
    }

    public async reopen() {
        if (!this.interaction.channel)
            throw new Error('サーバー内でのみ実行することができます');
        if (!this.interaction.guild)
            throw new Error('サーバー内でのみ実行することができます');

        if (this.interaction.channel.isDMBased())
            throw new Error('サーバー内でのみ実行することができます');
        if (this.interaction.channel.isThread())
            throw new Error('スレッド内で実行することはできません');

        const channelPermissions = [
            ...this.interaction.channel.permissionOverwrites.cache.values(),
        ];

        for (const permission of channelPermissions) {
            if (permission.type === OverwriteType.Role) continue;

            await permission.edit({
                ViewChannel: true,
            });
        }

        await this.interaction.message.delete();

        await this.interaction.channel.send({
            embeds: [
                {
                    title: 'チケットを再度開きました',
                    footer: client.footer(),
                    color: Colors.Blue,
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: 'チケットを閉じる',
                            customId: 'ticket_close',
                            style: ButtonStyle.Secondary,
                        },
                    ],
                },
            ],
            allowedMentions: {
                parse: [],
            },
        });
    }

    public async writeLogs() {
        if (!this.interaction.channel)
            throw new Error('サーバー内でのみ実行することができます');
        if (!this.interaction.guild)
            throw new Error('サーバー内でのみ実行することができます');

        if (this.interaction.channel.isDMBased())
            throw new Error('サーバー内でのみ実行することができます');
        if (this.interaction.channel.isThread())
            throw new Error('スレッド内で実行することはできません');

        const messages = await this.interaction.channel.messages.fetch();

        const buffer = Buffer.from(
            messages
                .map((message) => {
                    if (!message.content && !message.attachments) return;
                    if (!message.content && message.attachments) {
                        return message.attachments
                            .map((attachment) => {
                                return `<${message.author.tag}> ${attachment.url}`;
                            })
                            .join('\n');
                    }

                    if (message.content && message.attachments) {
                        const attachmentList = message.attachments
                            .map((attachment) => {
                                return `<${message.author.tag}> ${attachment.url}`;
                            })
                            .join('\n');
                        const contentList = `<${message.author.tag}> ${message.content}`;

                        return attachmentList + '\n' + contentList;
                    }

                    if (message.content && !message.attachments) {
                        return `<${message.author.tag}> ${message.content}`;
                    }
                })
                .join('\n'),
            'utf-8',
        );

        await this.interaction.channel.send({
            embeds: [
                {
                    description:
                        '過去100メッセージのログをテキストファイルとして書き出しました',
                    color: Colors.Grey,
                    footer: client.footer(),
                },
            ],
            files: [
                {
                    attachment: buffer,
                    name: 'output.txt',
                    description: `Saved ticket channel(${this.interaction.channel.id}) logs.`,
                },
            ],
        });

        await this.interaction.message.edit({
            embeds: [
                {
                    title: 'チケットを閉じました',
                    color: Colors.Grey,
                    footer: client.footer(),
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: '再度開く',
                            customId: 'reopen-ticket',
                            style: ButtonStyle.Secondary,
                        },
                        {
                            type: ComponentType.Button,
                            label: 'ログを書き出し',
                            customId: 'write-logs',
                            style: ButtonStyle.Primary,
                        },
                        {
                            type: ComponentType.Button,
                            label: 'チケットを削除',
                            customId: 'delete-ticket',
                            style: ButtonStyle.Danger,
                        },
                    ],
                },
            ],
        });
    }

    public async deleteChannel() {
        if (!this.interaction.channel)
            throw new Error('サーバー内でのみ実行することができます');
        if (!this.interaction.guild)
            throw new Error('サーバー内でのみ実行することができます');

        if (this.interaction.channel.isDMBased())
            throw new Error('サーバー内でのみ実行することができます');
        if (this.interaction.channel.isThread())
            throw new Error('スレッド内で実行することはできません');

        await this.interaction.message.delete();

        await this.interaction.channel.send({
            embeds: [
                {
                    description: '5秒後にチケットを削除します',
                    color: Colors.Red,
                    footer: client.footer(),
                },
            ],
        });

        setTimeout(async () => {
            await this.interaction.channel!.delete();
        }, 5000);
    }
}
