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

    /**
     * VoicevoxOptionsオブジェクトを使用して新しいインスタンスを初期化します。
     *
     * @param {VoicevoxOptions} options Voicevoxのオプション設定を指定します
     */
    constructor(options: VoicevoxOptions) {
        this.options = options;
    }

    /**
     * オーディオを生成する非同期メソッド。
     *
     * @param {GenerateAudioOptions} options 音声合成に必要なオプションを指定するオブジェクト。
     * @return {Promise<void>} オーディオ生成の処理が完了するPromise。
     */
    public async generateAudio(options: GenerateAudioOptions): Promise<void> {
        const synthesis = await this.synthesisAudio(options);

        await this.saveAudio(options.path, synthesis);
    }

    /**
     * Voicevox APIを使用して利用可能な話者のリストを取得します。
     *
     * @return {Promise<Speaker[]>} 話者の情報を含むPromiseオブジェクト
     */
    public static async getSpeakers(): Promise<Speaker[]> {
        const speakers = await axios.get(`${Voicevox.VV_API}/speakers`);

        return speakers.data;
    }

    /**
     * 指定されたスピーカースタイルIDに基づいて話者情報を取得する非同期関数。
     *
     * @param {number} speakerStyleId - 該当するスピーカーのスタイルID。
     * @return {Promise<SpeakerInfo>} 該当するスピーカーの情報を含むオブジェクトを返すPromise。
     * @throws {Error} 指定したスタイルIDに対応する話者が見つからない場合、または話者にスタイルIDが*/
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

    /**
     * 音声合成クエリを作成します。
     *
     * @param {AudioQueryOptions} options - 音声合成クエリの作成に必要なオプション。
     * @param {string} options.text - 合成するテキスト。
     * @param {number} [options.speaker] - 使用する話者ID。指定しない場合、デフォルトの話者が使用されます。
     * @return {Promise<Object>} 作成された音声合成クエリのデータを含むPromiseオブジェクト。
     * @throws {Error} クエリ作成時のエラー。ステータスコードとエラーメッセージが含まれます。
     */
    private async createAudioQuery(
        options: AudioQueryOptions,
    ): Promise<object> {
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

    /**
     * 音声を合成する非同期メソッド
     *
     * @param {SynthesisOptions} options 音声合成に必要なパラメーターを含むオブジェクト
     * @return {Promise<ArrayBuffer>} 合成された音声データ（ArrayBuffer形式）を解決するPromise
     * @throws {Error} 音声の合成に失敗した場合にエラーをスロー
     */
    private async synthesisAudio(
        options: SynthesisOptions,
    ): Promise<ArrayBuffer> {
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

    /**
     * 指定されたパスに音声データを保存します。
     *
     * @param {string} path 保存先のファイルパス
     * @param {ArrayBuffer} synthesis 保存する音声データのバッファ
     * @return {Promise<void>} 処理が完了したことを示すPromise
     */
    private async saveAudio(
        path: string,
        synthesis: ArrayBuffer,
    ): Promise<void> {
        fs.writeFileSync(path, Buffer.from(synthesis), 'binary');
    }
}
