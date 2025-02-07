import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICustomRole extends Document {
    guildId: string;
    userId: string;
    roleId: string;
}

const CustomRoleSchema: Schema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
});

const CustomRole: Model<ICustomRole> =
    mongoose.models.CustomRole ||
    mongoose.model<ICustomRole>('CustomRole', CustomRoleSchema);

export default CustomRole;
