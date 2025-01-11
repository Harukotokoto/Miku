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
const Command_1 = require("../../../libraries/Classes/Handlers/Command");
const discord_js_1 = require("discord.js");
const getCommands_1 = require("../../../libraries/Functions/Util/getCommands");
exports.default = new Command_1.Command({
    name: 'help',
    description: 'コマンドの詳細を表示します',
    contexts: [
        discord_js_1.InteractionContextType.PrivateChannel,
        discord_js_1.InteractionContextType.BotDM,
        discord_js_1.InteractionContextType.Guild,
    ],
    integrationTypes: [
        discord_js_1.ApplicationIntegrationType.UserInstall,
        discord_js_1.ApplicationIntegrationType.GuildInstall,
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const commands = yield (0, getCommands_1.getCommands)();
            const categories = [
                ...new Set(commands === null || commands === void 0 ? void 0 : commands.map((command) => command.category)),
            ];
            const categoryDictionary = {
                ai: 'AI系コマンド',
                auth: '認証系コマンド',
                dev: '開発者向けコマンド',
                fun: 'ネタ系コマンド',
                info: '情報系コマンド',
                secret: '秘密のコマンド',
                util: '便利系コマンド',
            };
            function getCategoryDisplayName(category) {
                if (categoryDictionary[category]) {
                    return categoryDictionary[category];
                }
                return category.charAt(0).toUpperCase() + category.slice(1);
            }
            yield interaction.followUp({
                embeds: [
                    {
                        title: '📪 Need help?',
                        description: 'カテゴリーとコマンドを選択してください\n' +
                            '\n' +
                            `現在のプレフィックス: \`${client.prefix}\`\n` +
                            'スラッシュコマンドも利用可能です。\n' +
                            'エイリアスはチャットコマンドにのみ対応しています。',
                        color: discord_js_1.Colors.Gold,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: discord_js_1.ComponentType.ActionRow,
                        components: [
                            {
                                type: discord_js_1.ComponentType.StringSelect,
                                options: categories.map((category) => {
                                    const categoryName = getCategoryDisplayName(category);
                                    return {
                                        label: categoryName,
                                        value: category,
                                    };
                                }),
                                placeholder: 'カテゴリーを選択',
                                customId: 'category_select',
                            },
                        ],
                    },
                    {
                        type: discord_js_1.ComponentType.ActionRow,
                        components: [
                            {
                                type: discord_js_1.ComponentType.StringSelect,
                                options: [
                                    {
                                        label: 'command',
                                        value: 'command',
                                    },
                                ],
                                placeholder: 'コマンドを選択',
                                customId: 'command_select',
                                disabled: true,
                            },
                        ],
                    },
                ],
            });
            const collecter = (yield interaction.fetchReply()).createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
            });
            collecter.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
                if (!i.isStringSelectMenu())
                    return;
                if (i.customId === 'category_select') {
                    const selectedCategory = i.values[0];
                    const categoryName = getCategoryDisplayName(selectedCategory);
                    const commandList = commands === null || commands === void 0 ? void 0 : commands.filter((cmd) => cmd.category === selectedCategory);
                    yield i.update({
                        embeds: [
                            {
                                title: categoryName,
                                fields: commandList === null || commandList === void 0 ? void 0 : commandList.map((command) => {
                                    return {
                                        name: command.command.name,
                                        value: command.command.description,
                                        inline: true,
                                    };
                                }),
                                color: discord_js_1.Colors.Gold,
                                footer: client.footer(),
                            },
                        ],
                        components: [
                            {
                                type: discord_js_1.ComponentType.ActionRow,
                                components: [
                                    {
                                        type: discord_js_1.ComponentType.StringSelect,
                                        options: categories.map((category) => {
                                            const categoryName = getCategoryDisplayName(category);
                                            return {
                                                label: categoryName,
                                                value: category,
                                            };
                                        }),
                                        placeholder: 'カテゴリーを選択',
                                        customId: 'category_select',
                                    },
                                ],
                            },
                            {
                                type: discord_js_1.ComponentType.ActionRow,
                                components: [
                                    {
                                        type: discord_js_1.ComponentType.StringSelect,
                                        options: commands
                                            .filter((command) => command.category ===
                                            selectedCategory)
                                            .map((command) => {
                                            return {
                                                label: '/' +
                                                    command.command.name,
                                                value: command.command.name,
                                                description: command.command
                                                    .description,
                                            };
                                        }),
                                        placeholder: 'コマンドを選択',
                                        customId: 'command_select',
                                    },
                                ],
                            },
                        ],
                    });
                }
                if (i.customId === 'command_select') {
                    const selectedCommand = i.values[0];
                    const cmd = commands === null || commands === void 0 ? void 0 : commands.find((cmd) => cmd.command.name === selectedCommand);
                    const command = cmd === null || cmd === void 0 ? void 0 : cmd.command;
                    if (!command)
                        return;
                    const commandName = command.name.charAt(0).toUpperCase() +
                        command.name.slice(1);
                    const aliases = command.aliases
                        .map((alias) => '`' + alias + '`')
                        .join(', ');
                    const commandDescription = command.description;
                    const commandUsage = command.usage;
                    const isOwnerCommand = command.isOwnerCommand;
                    const categoryName = getCategoryDisplayName(cmd === null || cmd === void 0 ? void 0 : cmd.category);
                    i.update({
                        embeds: [
                            {
                                title: (cmd === null || cmd === void 0 ? void 0 : cmd.category)
                                    ? categoryName + ' - ' + commandName
                                    : commandName,
                                description: commandDescription +
                                    '\n' +
                                    (isOwnerCommand
                                        ? '```fix\n※このコマンドは管理者限定です\n```'
                                        : ''),
                                fields: [
                                    {
                                        name: 'エイリアス',
                                        value: aliases ||
                                            'このコマンドにエイリアスは設定されていません',
                                    },
                                    {
                                        name: '使用方法',
                                        value: `\`\`\`\n${commandUsage}\n\`\`\``,
                                    },
                                ],
                                color: discord_js_1.Colors.Gold,
                                footer: client.footer(),
                            },
                        ],
                    });
                }
            }));
        }),
    },
});
