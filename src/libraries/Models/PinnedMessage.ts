import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPinMessage extends Document {
    guildId: string;
    channelId: string;
    messageId: string;
    lastMessageId: string;
}

const PinnedMessageSchema: Schema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
    },
    lastMessageId: {
        type: String,
        required: true,
    },
});

const PinnedMessage: Model<IPinMessage> =
    mongoose.models.PinnedMessage ||
    mongoose.model<IPinMessage>('Pinned_Message', PinnedMessageSchema);

export default PinnedMessage;
