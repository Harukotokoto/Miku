import { AudioPlayer } from '@discordjs/voice';

export interface GuildAudioQueue {
    queue: string[];
    isPlaying?: boolean;
    player: AudioPlayer;
    currentFilepath: string | null;
}
