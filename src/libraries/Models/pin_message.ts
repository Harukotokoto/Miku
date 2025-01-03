import { model, Schema } from 'mongoose';

const pin_model = model(
    'message_pins',
    new Schema({
        GuildID: {
            type: String,
            required: true,
        },
        ChannelID: {
            type: String,
            required: true,
        },
        MessageID: {
            type: String,
            required: true,
        },
        LastMessageID: {
            type: String,
            required: true,
        },
    }),
);

export { pin_model };
