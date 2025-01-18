import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISpeaker extends Document {
    userId: string;
    speakerId: number;
}

const SpeakerSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    speakerId: {
        type: Number,
        required: true,
    },
});

const Speaker: Model<ISpeaker> =
    mongoose.models.Speaker ||
    mongoose.model<ISpeaker>('Speaker', SpeakerSchema);

export default Speaker;
