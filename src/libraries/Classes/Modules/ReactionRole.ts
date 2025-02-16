import { APIRole, Colors, ComponentType, Guild, Role } from 'discord.js';
import ReactionRoleModel from '@/libraries/Models/ReactionRole';
import { client } from '@/index';
import { ReactionRoleOptions } from '@/interfaces/ReactionRoleOptions';

export class ReactionRole {
    private guild: Guild;

    public constructor(guild: Guild) {
        this.guild = guild;
    }

    public async create(
        id: string,
        options: ReactionRoleOptions,
    ): Promise<void> {
        const rr = await ReactionRoleModel.findOne({
            guildId: this.guild.id,
            rrId: id,
        });

        if (rr) {
            throw new Error('既に指定されたIDは使用されています');
        }

        const msg = await options.channel.send({
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
            guildId: this.guild.id,
            channelId: options.channel.id,
        });
    }

    public async remove(id: string) {
        const rr = await ReactionRoleModel.findOne({
            guildId: this.guild.id,
            rrId: id,
        });

        if (!rr) throw new Error('指定されたIDのパネルが見つかりませんでした');

        await ReactionRoleModel.findOneAndDelete({
            rrId: id,
            guildId: this.guild.id,
        });
    }

    public roles = {
        add: async (
            id: string,
            options: { role: Role | APIRole; label?: string | null },
        ): Promise<void> => {
            const panel = await ReactionRoleModel.findOne({
                guildId: this.guild.id,
                rrId: id,
            });

            if (!panel) {
                throw new Error('指定されたパネルが見つかりませんでした');
            }

            if (panel.roles.find((role) => role.roleId === options.role.id)) {
                throw new Error('指定されたロールは既に登録されています');
            }

            panel.roles.push({
                roleId: options.role.id,
                label: options?.label || options.role.name,
            });

            await panel.save();
        },

        delete: async (
            id: string,
            options: { role: Role | APIRole },
        ): Promise<void> => {
            const panel = await ReactionRoleModel.findOne({
                guildId: this.guild.id,
                rrId: id,
            });

            if (!panel) {
                throw new Error('指定されたIDのパネルは見つかりませんでした');
            }

            if (!panel.roles.find((role) => role.roleId === options.role.id)) {
                throw new Error('指定されたロールは登録されていません');
            }

            panel.roles.filter((role) => role.roleId !== options.role.id);

            await panel.save();
        },
    };

    public async refresh(id: string): Promise<void> {
        const panel = await ReactionRoleModel.findOne({
            guildId: this.guild.id,
            rrId: id,
        });

        if (!panel) return;

        const channel = this.guild.channels.cache.get(panel.channelId);
        if (!channel || !channel.isTextBased()) {
            await ReactionRoleModel.findOneAndDelete({
                guildId: this.guild.id,
                rrId: id,
            });
            return;
        }

        const message = await channel.messages
            .fetch(panel.messageId)
            .catch(async () => {
                await ReactionRoleModel.findOneAndDelete({
                    guildId: this.guild.id,
                    rrId: id,
                });
                return;
            });

        if (!message) {
            await ReactionRoleModel.findOneAndDelete({
                guildId: this.guild.id,
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
