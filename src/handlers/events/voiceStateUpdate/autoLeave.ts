import { Event } from '@/handlers/Event';
import { getVoiceConnection } from '@discordjs/voice';
import { ChannelType } from 'discord.js';
import { client } from '@/index';

export default new Event('voiceStateUpdate', async (oldState) => {
    const connection = getVoiceConnection(oldState.guild.id);
    if (connection) {
        const channel = oldState.channel?.id;
        if (!channel) return;

        const voiceChannel = oldState.guild.channels.cache.get(channel);
        if (!voiceChannel) return;
        if (
            voiceChannel.type !== ChannelType.GuildVoice &&
            voiceChannel.type !== ChannelType.GuildStageVoice
        )
            return;

        if (
            voiceChannel.members.filter((member) => !member.user.bot).size === 0
        ) {
            connection.destroy();
            client.readerChannels.delete(oldState.guild.id);
            client.guildAudioQueues.delete(oldState.guild.id);
        }
    }
});
