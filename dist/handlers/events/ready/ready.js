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
const Event_1 = require("../../../libraries/Classes/Handlers/Event");
const index_1 = require("../../../index");
const discord_js_1 = require("discord.js");
exports.default = new Event_1.Event('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!index_1.client.user) {
        return index_1.client.logger.error('クライアントユーザーが見つかりませんでした。');
    }
    index_1.client.logger.info(index_1.client.user.tag + 'でログインしました');
    index_1.client.logger.info('Prefix: ' + index_1.client.prefix);
    if (index_1.client.debugMode) {
        index_1.client.logger.debug('デバッグモードは有効です');
        index_1.client.user.setPresence({
            activities: [
                {
                    name: '開発モードが有効です',
                    type: discord_js_1.ActivityType.Listening,
                },
            ],
            status: 'dnd',
        });
    }
    else {
        index_1.client.user.setPresence({
            activities: [
                {
                    name: 'Im Here!',
                    type: discord_js_1.ActivityType.Playing,
                },
            ],
            status: 'online',
        });
    }
}));
