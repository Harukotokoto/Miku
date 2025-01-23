import {
    APIRole,
    ChatInputCommandInteraction,
    Colors,
    ComponentType,
    Message,
    PartialGroupDMChannel,
    Role,
} from 'discord.js';
import ReactionRoleModel from '@/libraries/Models/ReactionRole';
import { client } from '@/index';
import { CommandError } from '@/handlers/CommandError';
import { ReactionRoleOptions } from '@/interfaces/ReactionRoleOptions';

export class ReactionRole {
    protected InteractionOrMessage:
        | ChatInputCommandInteraction
        | Message<boolean>;

    /**
     * 新しいコンストラクタを初期化します。
     *
     * @param {ChatInputCommandInteraction | Message<boolean>} InteractionOrMessage ChatInputCommandInteractionまたはMessageオブジェクトを指定します。
     */
    public constructor(
        InteractionOrMessage: ChatInputCommandInteraction | Message<boolean>,
    ) {
        this.InteractionOrMessage = InteractionOrMessage;
    }

    /**
     * 指定されたIDを使用してリアクションロールパネルを作成します。
     *
     * @param {string} id - リアクションロールパネルを識別するための一意のID。
     * @param {ReactionRoleOptions} [options] - パネルのタイトルや説明など、オプション設定。
     * @return {Promise<void>} パネル作成の実行結果を非同期操作として返します。
     */
    public async create(
        id: string,
        options?: ReactionRoleOptions,
    ): Promise<void> {
        if (this.InteractionOrMessage instanceof ChatInputCommandInteraction) {
            const interaction = this.InteractionOrMessage;
            if (!interaction || !interaction.channel) return;

            const Error = new CommandError(interaction);

            const rr = await ReactionRoleModel.findOne({
                guildId: interaction.guild?.id,
                rrId: id,
            });

            if (rr)
                return await Error.create('既に指定されたIDは使用されています');

            if (interaction.channel instanceof PartialGroupDMChannel) return;

            const msg = await interaction.channel.send({
                embeds: [
                    {
                        title: options?.title || 'リアクションロール',
                        description:
                            options?.description?.replace(/\/\//g, '\n') ||
                            'メニューから取得したいロールを選択し、決定してください',
                        color: Colors.Gold,
                        footer: client.footer(),
                    },
                ],
            });

            await ReactionRoleModel.create({
                messageId: msg.id,
                rrId: id,
                guildId: interaction.guild?.id,
                channelId: interaction.channel.id,
            });

            await interaction.followUp({
                embeds: [
                    {
                        title: 'パネルを新規作成しました',
                        description: `識別ID: ${id}`,
                        color: Colors.Green,
                        footer: client.footer(),
                    },
                ],
            });
        }
    }

    /**
     * 指定されたIDのリアクションロールパネルを削除します。
     *
     * @param {string} id 削除したいリアクションロールパネルのID
     * @return {Promise<void>} 処理が完了した時点で何も返しません
     */
    public async remove(id: string) {
        if (this.InteractionOrMessage instanceof ChatInputCommandInteraction) {
            const interaction = this.InteractionOrMessage;
            if (!interaction || !interaction.channel) return;

            const Error = new CommandError(interaction);

            const rr = await ReactionRoleModel.findOne({
                guildId: interaction.guild?.id,
                rrId: id,
            });

            if (!rr)
                return await Error.create(
                    '指定されたIDのパネルが見つかりませんでした',
                );

            await ReactionRoleModel.findOneAndDelete({
                rrId: id,
                guildId: interaction.guild?.id,
            });

            await interaction.followUp({
                embeds: [
                    {
                        title: 'パネルを削除しました',
                        color: Colors.Red,
                        footer: client.footer(),
                    },
                ],
            });
        }
    }

    public roles = {
        /**
         * 指定されたIDのリアクションロールパネルにロールを追加します。
         *
         * @param {string} id - リアクションロールパネルの識別ID。
         * @param {Object} options - 追加するロールと表示名のオプションを指定します。
         * @param {Role | APIRole} options.role - 追加するロールオブジェクト。
         * @param {string | null} [options.label] - 追加するロールの表示名（省略可能）。
         * @returns {Promise<void>} 非同期処理のためのPromise。
         *
         * @throws 指定されたパネルIDが存在しない場合、または指定されたロールが既に登録されている場合、エラーを通知します。
         */
        add: async (
            id: string,
            options: { role: Role | APIRole; label?: string | null },
        ): Promise<void> => {
            if (
                this.InteractionOrMessage instanceof ChatInputCommandInteraction
            ) {
                const interaction = this.InteractionOrMessage;

                const Error = new CommandError(interaction);

                const panel = await ReactionRoleModel.findOne({
                    guildId: interaction.guild?.id,
                    rrId: id,
                });

                if (!panel) {
                    return await Error.create(
                        '指定されたIDのパネルは見つかりませんでした',
                    );
                }

                if (
                    panel.roles.find((role) => role.roleId === options.role.id)
                ) {
                    return await Error.create(
                        '指定されたロールは既に登録されています',
                    );
                }

                panel.roles.push({
                    roleId: options.role.id,
                    label: options?.label || options.role.name,
                });

                await panel.save();

                await interaction.followUp({
                    embeds: [
                        {
                            title: 'ロールを追加しました',
                            description:
                                `識別ID: ${id}\n\n` +
                                `追加したロール: ${options.role.toString()}\n` +
                                `表示名: ${options?.label || options.role.name}`,
                            color: Colors.Green,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
        /**
         * 指定されたIDに基づいてリアクションロールパネルからロールを削除します。
         *
         * @param {string} id 削除対象パネルの識別ID。
         * @param {Object} options 削除オプション。
         * @param {Role|APIRole} options.role 削除する対象ロール。
         *
         * @throws {CommandError} パネルが指定IDで見つからない場合、もしくは指定されたロールが登録されていない場合。
         *
         * @returns {Promise<void>} 操作が成功した場合、ユーザーにロール削除成功のメッセージを通知します。
         */
        delete: async (
            id: string,
            options: { role: Role | APIRole },
        ): Promise<void> => {
            if (
                this.InteractionOrMessage instanceof ChatInputCommandInteraction
            ) {
                const interaction = this.InteractionOrMessage;

                const Error = new CommandError(interaction);

                const panel = await ReactionRoleModel.findOne({
                    guildId: interaction.guild?.id,
                    rrId: id,
                });

                if (!panel) {
                    return await Error.create(
                        '指定されたIDのパネルは見つかりませんでした',
                    );
                }

                if (
                    !panel.roles.find((role) => role.roleId === options.role.id)
                ) {
                    return await Error.create(
                        '指定されたロールは登録されていません',
                    );
                }

                panel.roles.filter((role) => role.roleId !== options.role.id);

                await panel.save();

                await interaction.followUp({
                    embeds: [
                        {
                            title: 'ロールを削除しました',
                            description:
                                `識別ID: ${id}\n\n` +
                                `削除したロール: ${options.role.toString()}\n`,
                            color: Colors.Green,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
    };

    /**
     * 指定されたIDに基づいてリアクションロールの設定を更新し、対応するメッセージを編集します。
     * 存在しないまたはアクセスできない場合、データベースからそのエントリを削除します。
     *
     * @param {string} id リアクションロール設定のID
     * @return {Promise<void>} 非同期操作として実行され、成功もしくは失敗の処理が完了するPromise
     */
    public async refresh(id: string): Promise<void> {
        if (this.InteractionOrMessage instanceof ChatInputCommandInteraction) {
            const interaction = this.InteractionOrMessage;

            const panel = await ReactionRoleModel.findOne({
                guildId: interaction.guild?.id,
                rrId: id,
            });

            if (!panel) return;

            const channel = interaction.guild?.channels.cache.get(
                panel.channelId,
            );
            if (!channel || !channel.isTextBased()) {
                await ReactionRoleModel.findOneAndDelete({
                    guildId: interaction.guild?.id,
                    rrId: id,
                });
                return;
            }

            const message = await channel.messages
                .fetch(panel.messageId)
                .catch(async () => {
                    await ReactionRoleModel.findOneAndDelete({
                        guildId: interaction.guild?.id,
                        rrId: id,
                    });
                    return;
                });

            if (!message) {
                await ReactionRoleModel.findOneAndDelete({
                    guildId: interaction.guild?.id,
                    rrId: id,
                });
                return;
            }

            await message.edit({
                embeds: message.embeds,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.StringSelect,
                                options: panel.roles.map((role) => {
                                    return {
                                        label: role.label,
                                        value: role.roleId,
                                    };
                                }),
                                placeholder: 'ロールを選択',
                                customId: 'reaction_role',
                                minValues: 1,
                                maxValues: panel.roles.length,
                            },
                        ],
                    },
                ],
            });
        }
    }
}
