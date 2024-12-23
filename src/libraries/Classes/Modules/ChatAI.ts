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

  constructor(options: AIOptions) {
    this.category = options.category || null;
    this.model = options.model || null;
  }

  public async generate(options: GenerateOptions) {
    const { messages, raw = false } = options;

    const models = this.category
      ? await ChatAI.getModels({ category: this.category })
      : this.model
        ? await ChatAI.getModels({ model: this.model })
        : await ChatAI.getModels();

    const modelId = models[0].id;

    const response = await axios.post(`${this.originUrl}/chat/completions`, {
      model: modelId,
      messages: messages,
    });

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

  public static async getModels(options?: GetModelOptions) {
    const originUrl = 'https://api.voids.top/v1';

    const response = await axios.get(`${originUrl}/models`);
    const json: AvailableModels = response.data;

    if (options?.category) {
      return json.data.filter((data) => data.owned_by.match(options.category));
    } else if (options?.model) {
      return json.data.filter((data) => data.id.match(options.model));
    } else {
      return json.data;
    }
  }
}
