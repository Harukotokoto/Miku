import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILeveling extends Document {
    userId: string;
    guildId: string;
    xp: number;
    lastGiven: Date;
}

const LevelingSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        required: true,
    },
    lastGiven: {
        type: Date,
        required: true,
    },
});

const Leveling: Model<ILeveling> =
    mongoose.models.Level || mongoose.model<ILeveling>('Level', LevelingSchema);

export default Leveling;
