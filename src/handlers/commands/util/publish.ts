import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType, ChannelType, Colors } from 'discord.js';
import { AutoPublish } from '@/modules/AutoPublish';

export default new Command({
    name: 'publish',
    description: 'お知らせの自動公開設定を設定します',
    options: [
        {
            name: 'enable',
            description: 'お知らせの自動公開を有効にします',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: '有効にするチャンネル',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildAnnouncement],
                    required: true,
                },
            ],
        },
        {
            name: 'disable',
            description: 'お知らせの自動公開を無効にします',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: '無効にするチャンネル',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildAnnouncement],
                    required: true,
                },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            if (!interaction.guild) return;

            const cmd = interaction.options.getSubcommand();
            const channel = interaction.options.getChannel('channel', true, [
                ChannelType.GuildAnnouncement,
            ]);

            const autoPublish = new AutoPublish(channel);
            const isEnabled = await autoPublish.isEnabled();

            if (cmd === 'enable') {
                if (isEnabled) {
                    await interaction.followUp({
                        embeds: [
                            {
                                description:
                                    '自動公開設定は既に有効化されています',
                                color: Colors.Red,
                                footer: client.footer(),
                            },
                        ],
                    });
                } else {
                    await autoPublish.setAutoPublish(true);

                    await interaction.followUp({
                        embeds: [
                            {
                                title: '自動公開を有効化しました',
                                description: `${channel}に送信されたメッセージはBot、Webhookを除き、自動的に公開されます。`,
                                color: Colors.Green,
                                footer: client.footer(),
                            },
                        ],
                    });
                }
            } else if (cmd === 'disable') {
                if (isEnabled) {
                    await interaction.followUp({
                        embeds: [
                            {
                                title: '自動公開設定を無効化しました',
                                description:
                                    '今後自動的に公開されることはありません。',
                                color: Colors.Blue,
                                footer: client.footer(),
                            },
                        ],
                    });
                    await autoPublish.setAutoPublish(false);
                } else {
                    await interaction.followUp({
                        embeds: [
                            {
                                description:
                                    '自動公開設定は有効化されていません。',
                                color: Colors.Green,
                                footer: client.footer(),
                            },
                        ],
                    });
                }
            }
        },
    },
});
