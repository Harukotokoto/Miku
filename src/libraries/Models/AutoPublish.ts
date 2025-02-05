import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAutoPublish extends Document {
    channelId: string;
    isEnabled: boolean;
}

const AutoPublishSchema: Schema = new Schema({
    channelId: {
        type: String,
        required: true,
    },
    isEnabled: {
        type: Boolean,
        required: true,
    },
});

const AutoPublish: Model<IAutoPublish> =
    mongoose.models.AutoPublish ||
    mongoose.model<IAutoPublish>('AutoPublish', AutoPublishSchema);

export default AutoPublish;
