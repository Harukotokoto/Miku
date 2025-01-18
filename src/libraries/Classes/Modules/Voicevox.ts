import {
    AudioQueryOptions,
    GenerateAudioOptions,
    Speaker,
    SpeakerInfo,
    SynthesisOptions,
    VoicevoxOptions,
} from '@/interfaces/Voicevox';
import axios from 'axios';
import fs from 'fs';

export class Voicevox {
    private options: VoicevoxOptions;

    private static VV_API = process.env.VOICEVOX_API;

    constructor(options: VoicevoxOptions) {
        this.options = options;
    }

    public async generateAudio(options: GenerateAudioOptions) {
        const synthesis = await this.synthesisAudio(options);

        await this.saveAudio(options.path, synthesis);
    }

    public static async getSpeakers(): Promise<Speaker[]> {
        const speakers = await axios.get(`${Voicevox.VV_API}/speakers`);

        return speakers.data;
    }

    public static async getSpeakerInfo(
        speakerStyleId: number,
    ): Promise<SpeakerInfo> {
        const speakers = await this.getSpeakers();

        const speaker = speakers.find((sp: any) =>
            sp.styles.some((style: any) => style.id === speakerStyleId),
        );

        if (!speaker) {
            throw new Error(
                `スタイルID ${speakerStyleId} に対応する話者が見つかりません`,
            );
        }

        const speakerUuid = speaker.speaker_uuid;

        const speakerInfoResponse = await axios.get(
            `${Voicevox.VV_API}/speaker_info?speaker_uuid=${speakerUuid}`,
        );

        const speakerInfo = speakerInfoResponse.data;

        const styleInfo = speakerInfo.style_infos.find(
            (style: any) => style.id === speakerStyleId,
        );

        if (!styleInfo) {
            throw new Error(
                `スタイルID ${speakerStyleId} は話者 ${speaker.name} に存在しません`,
            );
        }

        const base64Icon = styleInfo.icon;

        return {
            icon: Buffer.from(base64Icon, 'base64'),
            speakerUuid,
            styleInfo,
            speaker,
        };
    }

    private async createAudioQuery(options: AudioQueryOptions) {
        const { text, speaker } = options;

        const audioQuery = await axios.post(
            `${Voicevox.VV_API}/audio_query?text=${encodeURI(text)}&speaker=${speaker || this.options.defaultSpeaker}`,
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
            `${Voicevox.VV_API}/synthesis?speaker=${options.speaker || this.options.defaultSpeaker}&enable_interrogative_upspeak=${options.enableInterrogativeUpspeak || true}`,
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
