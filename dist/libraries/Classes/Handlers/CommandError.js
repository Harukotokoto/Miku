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
exports.CommandError = exports.ErrorTypes = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../../index");
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes[ErrorTypes["Warn"] = discord_js_1.Colors.Yellow] = "Warn";
    ErrorTypes[ErrorTypes["Error"] = discord_js_1.Colors.Red] = "Error";
})(ErrorTypes || (exports.ErrorTypes = ErrorTypes = {}));
class CommandError {
    constructor(parent) {
        this.parent = parent;
    }
    create(message, ErrorType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.parent instanceof discord_js_1.CommandInteraction) {
                yield this.parent.followUp({
                    embeds: [
                        {
                            title: ErrorType === ErrorTypes.Error
                                ? 'エラーが発生しました'
                                : undefined,
                            description: message || undefined,
                            color: ErrorType || discord_js_1.Colors.Red,
                            footer: index_1.client.footer(),
                        },
                    ],
                });
            }
            else {
                yield this.parent.reply({
                    embeds: [
                        {
                            title: ErrorType === ErrorTypes.Error
                                ? 'エラーが発生しました'
                                : undefined,
                            description: message || undefined,
                            color: ErrorType || discord_js_1.Colors.Red,
                            footer: index_1.client.footer(),
                        },
                    ],
                    allowedMentions: {
                        parse: [],
                    },
                });
            }
        });
    }
    edit(message, ErrorType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.parent instanceof discord_js_1.CommandInteraction) {
                yield this.parent.editReply({
                    embeds: [
                        {
                            title: ErrorType === ErrorTypes.Error
                                ? 'エラーが発生しました'
                                : undefined,
                            description: message,
                            color: ErrorType || discord_js_1.Colors.Red,
                            footer: index_1.client.footer(),
                        },
                    ],
                });
            }
            else {
                new Error('Editエラーはコマンドでのみ使用できます');
            }
        });
    }
}
exports.CommandError = CommandError;
