"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const pin_message_1 = require("../../../libraries/Models/pin_message");
const Event_1 = require("../../../libraries/Classes/Handlers/Event");
exports.default = new Event_1.Event('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!index_1.client.pinned_channels.includes(message.channel.id))
        return;
    if (message.author.id === ((_a = index_1.client.user) === null || _a === void 0 ? void 0 : _a.id))
        return;
    const pin_data = yield pin_message_1.pin_model.findOne({ ChannelID: message.channel.id });
    if (!pin_data)
        return;
    const oldMessage = yield message.channel.messages.fetch(pin_data.LastMessageID);
    if (!oldMessage)
        return;
    yield oldMessage.delete();
    const msg = yield message.channel.send({
        embeds: oldMessage.embeds,
    });
    pin_data.LastMessageID = msg.id;
    yield pin_data.save();
}));
