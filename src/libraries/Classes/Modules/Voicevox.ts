import {
    AudioQueryOptions,
    GenerateAudioOptions,
    SynthesisOptions,
    VoicevoxOptions,
} from '@/interfaces/Voicevox';
import axios from 'axios';
import fs from 'fs';

export class Voicevox {
    private options: VoicevoxOptions;

    private VV_API = process.env.VOICEVOX_API;

    constructor(options: VoicevoxOptions) {
        this.options = options;
    }

    public async generateAudio(options: GenerateAudioOptions) {
        const synthesis = await this.synthesisAudio(options);

        await this.saveAudio(options.path, synthesis);
    }

    private async createAudioQuery(options: AudioQueryOptions) {
        const { text, speaker } = options;

        const audioQuery = await axios.post(
            `${this.VV_API}/audio_query?text=${encodeURI(text)}&speaker=${speaker || this.options.defaultSpeaker}`,
            {},
            {
                headers: {
                    accept: 'application/json',
                },
            },
        );

        if (audioQuery.status !== 200) {
            throw new Error(
                `${audioQuery.status}: 音声合成クエリの作成に失敗しました`,
            );
        }

        return audioQuery.data;
    }

    private async synthesisAudio(options: SynthesisOptions) {
        const query = await this.createAudioQuery(options);

        const audio = await axios.post(
            `${this.VV_API}/synthesis?speaker=${options.speaker || this.options.defaultSpeaker}&enable_interrogative_upspeak=${options.enableInterrogativeUpspeak || true}`,
            query,
            {
                headers: {
                    accept: 'audio/wav',
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',
            },
        );

        if (audio.status !== 200) {
            throw new Error(`${audio.status}: 音声の合成に失敗しました`);
        }

        return audio.data;
    }

    private async saveAudio(path: string, synthesis: Buffer) {
        fs.writeFileSync(path, Buffer.from(synthesis), 'binary');
    }
}
