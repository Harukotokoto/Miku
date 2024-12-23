"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pin_model = void 0;
const mongoose_1 = require("mongoose");
const pin_model = (0, mongoose_1.model)('message_pins', new mongoose_1.Schema({
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
}));
exports.pin_model = pin_model;
