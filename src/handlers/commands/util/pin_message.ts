import { ApplicationCommandType, Colors } from 'discord.js';
import { Command } from '@/handlers/Command';
import PinnedMessage from '@/libraries/Models/PinnedMessage';

export default new Command({
    name: 'メッセージを固定/解除',
    requiredPermissions: ['ManageMessages'],
    ephemeral: true,
    type: ApplicationCommandType.Message,
    execute: {
        interaction: async ({ client, interaction }) => {
            const message = interaction.targetMessage;

            const pin_data = await PinnedMessage.findOne({
                ChannelID: interaction.channel?.id,
            });
            if (!pin_data) {
                if (!message.content) {
                    await interaction.followUp({
                        embeds: [
                            {
                                title: 'メッセージを固定できませんでした',
                                description:
                                    'メッセージの内容がありません(埋め込みを固定することはできません)',
                                color: Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                    });

                    return;
                }

                if (!interaction.channel?.isSendable()) return;

                const msg = await interaction.channel.send({
                    embeds: [
                        {
                            description: message.content,
                            color: Colors.Gold,
                            author: {
                                name: message.author.displayName,
                                icon_url: message.author.displayAvatarURL(),
                            },
                        },
                    ],
                });

                await PinnedMessage.create({
                    GuildID: interaction.guild?.id,
                    ChannelID: interaction.channel?.id,
                    MessageID: message.id,
                    LastMessageID: msg?.id,
                });

                client.addPinnedChannels(interaction.channel?.id as string);

                await interaction.followUp({
                    embeds: [
                        {
                            description: 'メッセージを固定しました',
                            color: Colors.Green,
                            footer: client.footer(),
                        },
                    ],
                });
            } else {
                await PinnedMessage.deleteOne({
                    ChannelID: message.channel.id,
                });

                client.removePinnedChannels(interaction.channel?.id as string);

                await interaction.followUp({
                    embeds: [
                        {
                            title: 'メッセージの固定を解除しました',
                            footer: {
                                text: '既に固定されているメッセージがある場合は解除されます',
                            },
                            color: Colors.Red,
                        },
                    ],
                });
            }
        },
    },
});
