import { Command } from '@/handlers/Command';
import { joinVoiceChannel } from '@discordjs/voice';
import { Colors } from 'discord.js';

export default new Command({
    name: 'join',
    description: 'チャンネルのメッセージを読み上げます',
    execute: {
        interaction: async ({ client, interaction }) => {
            const guild = interaction.guild;
            if (!guild || !interaction.channel) return;

            const member = await interaction.guild.members.fetch(
                interaction.user.id,
            );
            if (!member) return;

            const channel = member.voice.channel;
            if (!channel) {
                await interaction.followUp({
                    embeds: [
                        {
                            description:
                                'まずはボイスチャットに参加する必要があります',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });

                return;
            }

            if (!channel.joinable) {
                await interaction.followUp({
                    embeds: [
                        {
                            description:
                                'ボイスチャンネルに参加することができません',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });

                return;
            }

            joinVoiceChannel({
                guildId: guild.id,
                channelId: channel.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfMute: false,
                selfDeaf: true,
            });

            client.readerChannels.set(
                interaction.guild.id,
                interaction.channel.id,
            );

            await interaction.followUp({
                embeds: [
                    {
                        description: '接続しました',
                        color: Colors.Blue,
                        footer: {
                            text: 'Powered by VOICEVOX',
                        },
                    },
                ],
            });
            return;
        },
    },
});
