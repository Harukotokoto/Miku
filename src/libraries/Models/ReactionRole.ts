import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReactionRole extends Document {
    rrId: string;
    messageId: string;
    channelId: string;
    guildId: string;
    roles: {
        roleId: string;
        label: string;
    }[];
}

const ReactionRoleSchema: Schema = new Schema({
    rrId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    roles: [
        {
            roleId: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                required: true,
            },
        },
    ],
});

const ReactionRole: Model<IReactionRole> =
    mongoose.models.ReactionRole ||
    mongoose.model<IReactionRole>('Reaction_Role', ReactionRoleSchema);

export default ReactionRole;
