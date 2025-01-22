import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    Colors,
    ComponentType,
} from 'discord.js';
import { Ticket } from '@/modules/Ticket';

export default new Command({
    name: 'ticket',
    description: 'チケットを設定します',
    requiredPermissions: ['ManageGuild'],
    options: [
        {
            name: 'parent',
            description: 'チケットを作成するカテゴリー',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildCategory],
            required: true,
        },
        {
            name: 'staff',
            description: 'スタッフのロール',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const message = await interaction.fetchReply();
            const parent = interaction.options.getChannel('parent', true, [
                ChannelType.GuildCategory,
            ]);
            const staffRole = interaction.options.getRole('staff', true);

            await Ticket.setup({
                messageId: message.id,
                parentId: parent.id,
                staffRoleId: staffRole.id,
            });

            await interaction.followUp({
                embeds: [
                    {
                        title: 'チケットを発行',
                        description:
                            'ボタンをクリックしてスタッフとの専用のチャンネルを作成し、サポートに連絡することができます',
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: 'チケットを作成',
                                emoji: '📩',
                                style: ButtonStyle.Secondary,
                                customId: 'ticket_button',
                            },
                        ],
                    },
                ],
            });
        },
    },
});
