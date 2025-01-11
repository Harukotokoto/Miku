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
const discord_js_1 = require("discord.js");
const index_1 = require("../../../index");
const Event_1 = require("../../../libraries/Classes/Handlers/Event");
const CommandError_1 = require("../../../libraries/Classes/Handlers/CommandError");
exports.default = new Event_1.Event('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (interaction.isCommand()) {
        const command = index_1.client.commands.get(interaction.commandName);
        const Error = new CommandError_1.CommandError(interaction);
        if (!interaction.guild && interaction.inGuild()) {
            yield interaction.deferReply({
                ephemeral: true,
            });
        }
        else {
            yield interaction.deferReply({
                ephemeral: (command === null || command === void 0 ? void 0 : command.ephemeral) || false,
            });
        }
        if (!command)
            return yield Error.create('コマンドが存在しません');
        if (!command.execute.interaction)
            return yield Error.create('コマンドがスラッシュコマンドに対応していません', CommandError_1.ErrorTypes.Warn);
        if (command.isOwnerCommand &&
            !index_1.client.admins.includes(interaction.user.id)) {
            return yield Error.create('このコマンドはBot関係者のみ実行可能です', CommandError_1.ErrorTypes.Warn);
        }
        if (index_1.client.debugMode && !index_1.client.admins.includes(interaction.user.id)) {
            return yield Error.create('開発モードが有効です\n許容されたユーザーのみコマンドを実行することができます', CommandError_1.ErrorTypes.Warn);
        }
        if (interaction.guild) {
            const member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(interaction.user.id);
            if (!member)
                return;
            if (!member.permissions.has(command.requiredPermissions || [])) {
                return yield Error.create('このコマンドを使用する権限が不足しています');
            }
        }
        if (!command.type ||
            command.type === discord_js_1.ApplicationCommandType.ChatInput) {
            yield command.execute.interaction({
                client: index_1.client,
                interaction: interaction,
            });
        }
        if (command.type === discord_js_1.ApplicationCommandType.Message) {
            yield command.execute.interaction({
                client: index_1.client,
                interaction: interaction,
            });
        }
        if (command.type === discord_js_1.ApplicationCommandType.User) {
            yield command.execute.interaction({
                client: index_1.client,
                interaction: interaction,
            });
        }
    }
    else if (interaction.isAutocomplete()) {
        const command = index_1.client.commands.get(interaction.commandName);
        if (!command || !command.execute.autoComplete)
            return;
        yield command.execute.autoComplete({
            client: index_1.client,
            interaction,
        });
    }
}));
