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

    public constructor(
        InteractionOrMessage: ChatInputCommandInteraction | Message<boolean>,
    ) {
        this.InteractionOrMessage = InteractionOrMessage;
    }

    public async create(id: string, options?: ReactionRoleOptions) {
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
        add: async (
            id: string,
            options: { role: Role | APIRole; label?: string | null },
        ) => {
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
        delete: async (id: string, options: { role: Role | APIRole }) => {
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

    public async refresh(id: string) {
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
