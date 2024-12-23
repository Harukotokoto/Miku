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
exports.ChatAI = void 0;
const axios_1 = __importDefault(require("axios"));
class ChatAI {
    constructor(options) {
        this.originUrl = `${process.env.VOIDS_API}/v1`;
        this.category = options.category || null;
        this.model = options.model || null;
    }
    generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messages, raw = false } = options;
            const models = this.category
                ? yield ChatAI.getModels({ category: this.category })
                : this.model
                    ? yield ChatAI.getModels({ model: this.model })
                    : yield ChatAI.getModels();
            const modelId = models[0].id;
            const response = yield axios_1.default.post(`${this.originUrl}/chat/completions`, {
                model: modelId,
                messages: messages,
            });
            if (response.status >= 200 && response.status < 300) {
                if (raw) {
                    return response.data;
                }
                else {
                    return response.data.choices[0].message.content;
                }
            }
            else {
                if (raw) {
                    return response.data;
                }
                else {
                    return null;
                }
            }
        });
    }
    static getModels(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const originUrl = 'https://api.voids.top/v1';
            const response = yield axios_1.default.get(`${originUrl}/models`);
            const json = response.data;
            if (options === null || options === void 0 ? void 0 : options.category) {
                return json.data.filter((data) => data.owned_by.match(options.category));
            }
            else if (options === null || options === void 0 ? void 0 : options.model) {
                return json.data.filter((data) => data.id.match(options.model));
            }
            else {
                return json.data;
            }
        });
    }
}
exports.ChatAI = ChatAI;
