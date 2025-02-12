import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISavedRoles extends Document {
    guildId: string;
    memberId: string;
    roles: string[];
}

const SavedRolesSchema: Schema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    memberId: {
        type: String,
        required: true,
    },
    roles: {
        type: [
            {
                type: String,
                required: true,
            },
        ],
        required: true,
    },
});

const SavedRoles: Model<ISavedRoles> =
    mongoose.models.SavedRoles ||
    mongoose.model<ISavedRoles>('SavedRoles', SavedRolesSchema);

export default SavedRoles;
