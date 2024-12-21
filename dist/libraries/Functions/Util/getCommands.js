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
exports.getCommands = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../../index");
const getCommands = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const commands = [];
    const commandFiles = yield index_1.client.globPromise(`${__dirname}/../../../handlers/commands/**/*{.ts,.js}`);
    for (const filePath of commandFiles) {
        const parts = filePath.split('/');
        const directoryPath = parts.slice(0, -1).join('/');
        const category = directoryPath.split('/').pop() || 'No Category';
        const command = yield index_1.client.importFile(filePath);
        if (!command)
            continue;
        if (command.type && command.type !== discord_js_1.ApplicationCommandType.ChatInput)
            continue;
        const commandOptions = (_a = command.options) === null || _a === void 0 ? void 0 : _a.map((option) => {
            var _a;
            if (option.type === discord_js_1.ApplicationCommandOptionType.Subcommand) {
                const options = ((_a = option.options) === null || _a === void 0 ? void 0 : _a.map((option) => {
                    if (option.required) {
                        return '<' + option.name + '>';
                    }
                    else {
                        return '<' + option.name + '?>';
                    }
                }).join(' ')) || '';
                return {
                    type: 'withSubCommand',
                    value: option.name + ' ' + options,
                };
            }
            else if (option.type !== discord_js_1.ApplicationCommandOptionType.SubcommandGroup) {
                if (option.required) {
                    return {
                        type: 'Option',
                        value: '<' + option.name + '>',
                    };
                }
                else {
                    return {
                        type: 'Option',
                        value: '<' + option.name + '?>',
                    };
                }
            }
        });
        const usage = commandOptions
            ? (commandOptions === null || commandOptions === void 0 ? void 0 : commandOptions.map((option) => (option === null || option === void 0 ? void 0 : option.type) === 'withSubCommand'))
                ? commandOptions === null || commandOptions === void 0 ? void 0 : commandOptions.map((option) => command.name + ' ' + (option === null || option === void 0 ? void 0 : option.value)).join('\n')
                : command.name +
                    ' ' +
                    (commandOptions === null || commandOptions === void 0 ? void 0 : commandOptions.map((option) => option === null || option === void 0 ? void 0 : option.value).join(' '))
            : null;
        commands.push({
            category: category,
            command: {
                name: command.name,
                description: command.description,
                aliases: command.aliases || [],
                usage: usage || '/' + command.name,
                isOwnerCommand: !!command.isOwnerCommand,
            },
        });
    }
    return commands;
});
exports.getCommands = getCommands;
