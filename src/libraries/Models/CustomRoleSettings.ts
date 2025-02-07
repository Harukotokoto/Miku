import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICustomRoleSettings extends Document {
    guildId: string;
    anchorRoleId: string;
    requiredRoleId?: string;
    options: {
        allowAdminBypass?: boolean;
    };
}

const CustomRoleSettingsSchema: Schema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    anchorRoleId: {
        type: String,
        required: true,
    },
    requiredRoleId: {
        type: String,
        required: false,
    },
    options: {
        allowAdminBypass: {
            type: Boolean,
            default: false,
        },
    },
});

const CustomRoleSettings: Model<ICustomRoleSettings> =
    mongoose.models.CustomRoleSettings ||
    mongoose.model<ICustomRoleSettings>(
        'CustomRoleSettings',
        CustomRoleSettingsSchema,
    );

export default CustomRoleSettings;
