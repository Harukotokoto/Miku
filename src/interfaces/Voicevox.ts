import { AudioPlayer } from '@discordjs/voice';

export interface AudioQueryOptions {
    text: string;
    speaker?: number;
}

export interface GenerateAudioOptions extends SynthesisOptions {
    path: string;
}

export interface VoicevoxOptions {
    defaultSpeaker: number;
}

export interface SynthesisOptions extends AudioQueryOptions {
    enableInterrogativeUpspeak?: boolean;
}

export interface GuildAudioQueue {
    queue: string[];
    isPlaying?: boolean;
    player: AudioPlayer;
    currentFilepath: string | null;
}
