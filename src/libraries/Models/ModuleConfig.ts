import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IModuleConfig extends Document {
    guildId: string;
    modules: {
        moduleId: string;
        isEnabled: boolean;
    }[];
}

const ModuleConfigSchema: Schema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    modules: [
        {
            moduleId: {
                type: String,
                required: true,
            },
            isEnabled: {
                type: Boolean,
                required: true,
            },
        },
    ],
});

const ModuleConfig: Model<IModuleConfig> =
    mongoose.models.ModuleConfig ||
    mongoose.model<IModuleConfig>('ModuleConfig', ModuleConfigSchema);

export default ModuleConfig;
