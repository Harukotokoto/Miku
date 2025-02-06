import axios from 'axios';
import { client } from '@/index';
import { MakeItAQuoteOptions } from '@/interfaces/MakeItAQuoteOptions';

export class MakeItAQuote {
    private text: string | undefined;
    private avatarURL: string | undefined;
    private username: string | undefined;
    private display_name: string | undefined;
    private color: boolean | undefined;
    private watermark: string | undefined;

    /**
     * MakeItAQuoteOptions オブジェクトを使用してインスタンスを作成します。
     *
     * @param {MakeItAQuoteOptions} [options] テキスト、アバターURL、ユーザー名、表示名など、インスタンスを構成するオプションを含むオブジェクト
     */
    public constructor(options?: MakeItAQuoteOptions) {
        this.text = options?.text;
        this.avatarURL = options?.avatarURL;
        this.username = options?.username;
        this.display_name = options?.display_name;
        this.color = options?.color || false;
        this.watermark = options?.watermark || client.user?.tag || '';
    }

    /**
     * `setText`は、渡された文字列を設定し、現在のインスタンスを返します。
     *
     * @param {string} text - 設定したい文字列。
     * @returns {this} 現在のインスタンスを返します。
     */
    public setText(text: string): this {
        this.text = text;

        return this;
    }

    /**
     * アバターのURLを設定します。
     *
     * @param {string} url 設定するアバターのURL
     * @return {this} このインスタンス自身を返します
     */
    public setAvatarURL(url: string): this {
        this.avatarURL = url;

        return this;
    }

    /**
     * ユーザー名を設定します。
     *
     * @param {string} username 設定するユーザー名
     * @return {this} 現在のインスタンスを返します
     */
    public setUsername(username: string): this {
        this.username = username;

        return this;
    }

    /**
     * ユーザーの表示名を設定します。
     *
     * @param {string} display_name 設定する表示名
     * @return {this} このインスタンス自身を返します
     */
    public setDisplayName(display_name: string) {
        this.display_name = display_name;

        return this;
    }

    /**
     * 色の設定を行います。
     *
     * @param {boolean} [color=true] 設定する色の状態。デフォルトは true です。
     * @return {this} メソッドチェーンをサポートするための自身のインスタンス。
     */
    public setColor(color = true): this {
        this.color = color;

        return this;
    }

    /**
     * ウォーターマークを設定します。
     *
     * @param {string} watermark 設定するウォーターマークの文字列。
     * @return {this} 現在のインスタンスを返します。
     */
    public setWatermark(watermark: string): this {
        this.watermark = watermark;

        return this;
    }

    /**
     * 指定されたプロパティを利用して、Make it a Quote画像を生成し、その画像データをバッファとして返します。
     *
     * 必須プロパティとして、text、avatarURL、username、display_nameが必要です。
     *
     * @return {Promise<Buffer>} 生成されたMake it a Quote画像のバイナリデータを表すBufferオブジェクト。
     * @throws {Error} テキスト、アバター、ユーザー名、または表示名が不足している場合にスローされます。
     */
    public async build(): Promise<Buffer> {
        const { text, avatarURL, username, display_name, color, watermark } =
            this;

        if (!text) throw new Error('テキストが指定されていません');
        if (!avatarURL) throw new Error('アバターが指定されていません');
        if (!username) throw new Error('ユーザー名が指定されていません');
        if (!display_name) throw new Error('表示名が指定されていません');

        const imageBuffer = await axios.post(
            `https://api.voids.top/fakequotebeta`,
            {
                text: text,
                avatar: avatarURL,
                username: username,
                display_name: display_name,
                color: color || false,
                watermark: watermark || '',
            },
            {
                responseType: 'arraybuffer',
            },
        );

        return Buffer.from(imageBuffer.data, 'binary');
    }
}
