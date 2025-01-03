import { ModelCategories } from '@/libraries/Enums/ModelCategories';
import { AIRoles } from '@/libraries/Enums/AIRoles';

interface AIOptionsCategory {
    category: ModelCategories;
    model?: never;
}

interface AIOptionsModel {
    model: string;
    category?: never;
}

type AIOptions = AIOptionsCategory | AIOptionsModel;

interface GetModelOptionsCategory {
    category: ModelCategories;
    model?: never;
}

interface GetModelOptionsModel {
    category?: never;
    model: string;
}

type GetModelOptions = GetModelOptionsCategory | GetModelOptionsModel;

interface AvailableModelsData {
    id: string;
    owned_by: string;
    object: string;
    created_at: number;
}

interface AvailableModels {
    object: string;
    data: AvailableModelsData[];
}

interface MessageType {
    role: AIRoles;
    content: string;
}

interface GenerateOptions {
    messages: MessageType[];
    raw?: boolean;
}

export { AIOptions, GetModelOptions, AvailableModels, GenerateOptions };
