import axios from 'axios';
import { ModelCategories } from '@/libraries/Enums/ModelCategories';
import {
    AIOptions,
    AvailableModels,
    GenerateOptions,
    GetModelOptions,
} from '@/interfaces/ChatAI';

export class ChatAI {
    private readonly category: ModelCategories | null;
    private readonly model: string | null;
    private originUrl = `${process.env.VOIDS_API}/v1`;

    public static modelDictionaly: Record<string, string> = {
        openai: 'ChatGPT',
        'x.ai': 'Grok',
        anthropic: 'Claude',
        google: 'Gemini',
    };

    /**
     * AIOptionsオブジェクトを受け取り、AIのカテゴリとモデルを初期化するコンストラクタ。
     *
     * @param {AIOptions} options AI設定情報を含むオブジェクト
     */
    constructor(options: AIOptions) {
        this.category = options.category || null;
        this.model = options.model || null;
    }

    /**
     * 指定されたオプションに基づいてテキスト生成を行います。
     *
     * @param {GenerateOptions} options テキスト生成に必要なオプション。以下を含みます:
     *   - `messages` {Array} メッセージの配列。
     *   - `raw` {boolean} (オプション) 生データを返すかを指定。デフォルトは `false` です。
     * @return 正常に完了した場合は生成されたテキスト、`raw` が true の場合は生データを返します。
     *  エラーまたは予期しない応答の場合は `null` を返します。
     */
    public async generate(options: GenerateOptions) {
        const { messages, raw = false } = options;

        const models = this.category
            ? await ChatAI.getModels({ category: this.category })
            : this.model
              ? await ChatAI.getModels({ model: this.model })
              : await ChatAI.getModels();

        const modelId = models[0].id;

        const response = await axios.post(
            `${this.originUrl}/chat/completions`,
            {
                model: modelId,
                messages: messages,
            },
        );

        if (response.status >= 200 && response.status < 300) {
            if (raw) {
                return response.data;
            } else {
                return response.data.choices[0].message.content;
            }
        } else {
            if (raw) {
                return response.data;
            } else {
                return null;
            }
        }
    }

    /**
     * モデルを取得する非同期関数。
     *
     * @param {GetModelOptions} [options] モデル取得のオプション設定。
     * options.categoryが指定されている場合、該当するカテゴリーのモデルを返却。
     * options.modelが指定されている場合、該当するモデルIDのモデルを返却。
     * オプションが指定されない場合、全てのモデルデータを返却。
     *
     * @return {Promise<AvailableModels[]>} 条件に一致するモデル情報の配列を含むPromise。
     */
    public static async getModels(options?: GetModelOptions) {
        const originUrl = 'https://api.voids.top/v1';

        const response = await axios.get(`${originUrl}/models`);
        const json: AvailableModels = response.data;

        if (options?.category) {
            return json.data.filter((data) =>
                data.owned_by.match(options.category),
            );
        } else if (options?.model) {
            return json.data.filter((data) => data.id.match(options.model));
        } else {
            return json.data;
        }
    }
}
