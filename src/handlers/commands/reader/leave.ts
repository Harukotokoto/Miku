import { Command } from '@/handlers/Command';
import { getVoiceConnection } from '@discordjs/voice';
import { ChannelType, Colors } from 'discord.js';

export default new Command({
    name: 'leave',
    description: '読み上げを終了します',
    execute: {
        interaction: async ({ client, interaction }) => {
            const guild = interaction.guild;
            if (!guild) return;

            const member = await interaction.guild.members.fetch(
                interaction.user.id,
            );
            if (!member) return;

            const channel = member.voice.channel;
            if (!channel) {
                return interaction.followUp({
                    embeds: [
                        {
                            description:
                                'まずはボイスチャットに参加する必要があります',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            if (!channel.joinable) {
                return interaction.followUp({
                    embeds: [
                        {
                            description:
                                'ボイスチャンネルに参加することができません',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            const connection = getVoiceConnection(channel.guild.id);
            if (!connection) {
                return interaction.followUp({
                    embeds: [
                        {
                            description: 'VCに接続していません',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }

            connection.destroy();
            client.readerChannels.delete(interaction.guild.id);

            await interaction.followUp({
                embeds: [
                    {
                        description: '切断しました',
                        color: Colors.Blue,
                        footer: client.footer(),
                    },
                ],
            });
            return;
        },
    },
});
