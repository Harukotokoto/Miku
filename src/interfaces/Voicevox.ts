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

export interface Speaker {
    name: string;
    speaker_uuid: string;
    styles: [
        {
            name: string;
            id: number;
            type: string;
        },
    ];
    version: string;
    supported_features: {
        permitted_synthesis_morphing: string;
    };
}

export interface SpeakerInfo {
    icon: Buffer;
    speakerUuid: string;
    styleInfo: {
        name: string;
        id: number;
        type: string;
    };
    speaker: Speaker;
}
