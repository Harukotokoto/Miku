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
const CommandError_1 = require("../../../libraries/Classes/Handlers/CommandError");
exports.default = new Event_1.Event('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = index_1.client.prefix;
    const Error = new CommandError_1.CommandError(message);
    if (message.author.bot ||
        !message.guild ||
        !message.content.startsWith(prefix)) {
        return;
    }
    const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const command = index_1.client.commands.get(cmd.toLowerCase()) ||
        index_1.client.commands.find((c) => { var _a; return (_a = c.aliases) === null || _a === void 0 ? void 0 : _a.includes(cmd.toLowerCase()); });
    if (!command || !command.execute.message)
        return;
    const member = message.guild.members.cache.get(message.author.id);
    if (!member)
        return;
    if (command.isOwnerCommand && !index_1.client.admins.includes(message.author.id)) {
        return yield Error.create('このコマンドはBot関係者のみ実行可能です', CommandError_1.ErrorTypes.Warn);
    }
    if (index_1.client.debugMode && !index_1.client.admins.includes(message.author.id)) {
        return yield Error.create('開発モードが有効です\n' +
            '許容されたユーザーのみコマンドを実行することができます', CommandError_1.ErrorTypes.Warn);
    }
    if (!member.permissions.has(command.requiredPermissions || [])) {
        return yield Error.create('このコマンドを使用する権限が不足しています');
    }
    yield command.execute.message({ client: index_1.client, message, args });
}));
