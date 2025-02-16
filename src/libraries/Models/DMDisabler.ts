import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDMDisabler extends Document {
    lastExecute: Date;
}

const DMDisablerSchema: Schema = new Schema({
    lastExecute: {
        type: Date,
        required: true,
    },
});

const DMDisabler: Model<IDMDisabler> =
    mongoose.models.DMDisabler ||
    mongoose.model<IDMDisabler>('DMDisabler', DMDisablerSchema);

export default DMDisabler;
