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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeItAQuote = void 0;
const axios_1 = __importDefault(require("axios"));
class MakeItAQuote {
    constructor(text, avatarURL, username, display_name, color, watermark) {
        this.text = text;
        this.avatarURL = avatarURL;
        this.username = username;
        this.display_name = display_name;
        this.color = color;
        this.watermark = watermark;
        this.setText = (text) => {
            this.text = text;
            return this;
        };
        this.setAvatarURL = (url) => {
            this.avatarURL = url;
            return this;
        };
        this.setUsername = (username) => {
            this.username = username;
            return this;
        };
        this.setDisplayName = (display_name) => {
            this.display_name = display_name;
            return this;
        };
        this.setColor = (color = true) => {
            this.color = color;
            return this;
        };
        this.setWatermark = (watermark) => {
            this.watermark = watermark;
            return this;
        };
        this.build = () => __awaiter(this, void 0, void 0, function* () {
            const { text, avatarURL, username, display_name, color, watermark } = this;
            if (!text)
                throw new Error('テキストが指定されていません');
            if (!avatarURL)
                throw new Error('アバターが指定されていません');
            if (!username)
                throw new Error('ユーザー名が指定されていません');
            if (!display_name)
                throw new Error('表示名が指定されていません');
            const imageBuffer = yield axios_1.default.post(`https://api.voids.top/fakequotebeta`, {
                text: text,
                avatar: avatarURL,
                username: username,
                display_name: display_name,
                color: color || false,
                watermark: watermark || '',
            }, {
                responseType: 'arraybuffer',
            });
            return Buffer.from(imageBuffer.data, 'binary');
        });
    }
}
exports.MakeItAQuote = MakeItAQuote;
