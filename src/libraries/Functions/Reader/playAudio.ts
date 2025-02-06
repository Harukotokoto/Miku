import {
    AudioPlayer,
    createAudioResource,
    getVoiceConnection,
    StreamType,
} from '@discordjs/voice';

export async function playAudio(
    guildId: string,
    filepath: string,
    player: AudioPlayer,
) {
    const connection = getVoiceConnection(guildId);

    if (!connection) return;

    const resource = createAudioResource(filepath, {
        inputType: StreamType.Arbitrary,
    });

    player.play(resource);

    connection.subscribe(player);
}
