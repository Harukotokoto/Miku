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

    /**
     * コンストラクタは、ButtonInteractionオブジェクトを受け取り、プロパティを初期化します。
     *
     * @param {ButtonInteraction} interaction ボタンインタラクションのインスタンス
     */
    public constructor(interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    /**
     * チケットを設定し、新しいチケットを作成します。
     *
     * @param {TicketSetupOptions} options チケット設定のためのオプションオブジェクト
     * @return {Promise<Object>} 作成されたチケットオブジェクトを返します
     */
    public static async setup(options: TicketSetupOptions): Promise<object> {
        return await ticket.create({
            ...options,
            ticketId: randomUUID(),
        });
    }

    /**
     * 新しいチケット専用のテキストチャンネルを作成します。
     *
     * @param {ModalSubmitInteraction} interaction ユーザーのモーダル送信イベントに関連付けられたインタラクションオブジェクト
     * @return {Promise<string>} 作成されたチャンネルのID
     * @throws {Error} サーバー外で実行された場合や、関連するデータが見つからない場合にエラーが発生します
     */
    public static async create(
        interaction: ModalSubmitInteraction,
    ): Promise<string> {
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

        const msg = await channel.send({
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

        await msg.pin();

        return channel.id;
    }

    /**
     * このメソッドは特定のチャンネルのチケットを閉じる処理を行います。
     * チャンネルがサーバー内の適切な形式であることを確認し、
     * 必要な権限を変更して「チケットを閉じました」というメッセージを送信します。
     *
     * @throws {Error} サーバー外またはスレッドチャンネルで実行された場合にエラーをスローします。
     * @return {Promise<void>} 処理が正常に完了した場合、解決可能な Promise を返します。
     */
    public async close(): Promise<void> {
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

    /**
     * チケットを再度開くメソッド。指定されたチャンネルのアクセス権限を更新し、チケットに関連するメッセージやUI要素を再設定します。
     *
     * 特定の条件下でのみ実行可能であり、以下の条件を満たす必要があります:
     * - メソッドがサーバー内で実行されていること (DMまたはスレッド内では実行不可)。
     * - 対象のチャンネルがThreadまたはDMではないこと。
     *
     * エラー条件:
     * - サーバー外やスレッド内で実行しようとした場合に例外をスローします。
     *
     * @return {Promise<void>} チケットの再オープン処理が完了すると解決されるPromiseを返します。
     */
    public async reopen(): Promise<void> {
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

    /**
     * 指定されたチャンネルの最新100件のメッセージログをテキストファイルとして書き出し、添付ファイルとして送信します。
     * また、ログ生成後にメッセージを編集してチケットアクションを更新します。
     *
     * @return {Promise<void>} このメソッドでは非同期操作を行うため、Promise が返されます。操作が完了すると解決されます。
     * @throws {Error} チャンネルがサーバー内でない場合や、スレッドで実行された際に例外が発生します。
     */
    public async writeLogs(): Promise<void> {
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

    /**
     * 指定されたチャンネルを削除する非同期メソッド。
     * このメソッドはサーバー内でのみ実行可能であり、
     * DMやスレッド上では使用できません。
     *
     * @return {Promise<void>} チャンネルの削除処理が完了したことを示すPromise。
     *                         指定条件を満たさない場合にエラーをスローします。
     */
    public async deleteChannel(): Promise<void> {
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
            await this.interaction.channel?.delete();
        }, 5000);
    }
}
