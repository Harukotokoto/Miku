import axios from 'axios';

export class MakeItAQuote {
    public constructor(
        private text?: string,
        private avatarURL?: string,
        private username?: string,
        private display_name?: string,
        private color?: boolean,
        private watermark?: string,
    ) {}

    public setText = (text: string) => {
        this.text = text;
        return this;
    };

    public setAvatarURL = (url: string) => {
        this.avatarURL = url;
        return this;
    };

    public setUsername = (username: string) => {
        this.username = username;
        return this;
    };

    public setDisplayName = (display_name: string) => {
        this.display_name = display_name;
        return this;
    };

    public setColor = (color: boolean = true) => {
        this.color = color;
        return this;
    };

    public setWatermark = (watermark: string) => {
        this.watermark = watermark;
        return this;
    };

    public build = async () => {
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
    };
}
