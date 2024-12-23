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
const ChatAI_1 = require("../../../libraries/Classes/Modules/ChatAI");
const CommandError_1 = require("../../../libraries/Classes/Handlers/CommandError");
const Pagination_1 = require("../../../libraries/Classes/Utils/Pagination");
const AIRoles_1 = require("../../../libraries/Enums/AIRoles");
exports.default = new Command_1.Command({
    name: 'chatai',
    description: 'AIと会話します',
    options: [
        {
            name: 'models',
            description: '使用可能なModelを一覧表示します',
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'category',
                    description: 'Modelのカテゴリ',
                    choices: [
                        { name: 'ChatGPT', value: 'openai' },
                        { name: 'Grok', value: 'x.ai' },
                        { name: 'Claude', value: 'anthropic' },
                        { name: 'Gemini', value: 'google' },
                    ],
                    type: discord_js_1.ApplicationCommandOptionType.String,
                },
            ],
        },
        {
            name: 'chat',
            description: 'AIと会話します',
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'content',
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: '内容',
                    required: true,
                },
                {
                    name: 'model',
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    autocomplete: true,
                    description: '使用するモデル',
                },
            ],
        },
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const cmd = interaction.options.getSubcommand();
            const { create } = new CommandError_1.CommandError(interaction);
            if (cmd === 'models') {
                const category = interaction.options.getString('category');
                const models = category
                    ? yield ChatAI_1.ChatAI.getModels({ category })
                    : yield ChatAI_1.ChatAI.getModels();
                const sortedModels = models.reduce((acc, model) => {
                    if (!acc[model.owned_by]) {
                        acc[model.owned_by] = [];
                    }
                    acc[model.owned_by].push(model.id);
                    return acc;
                }, {});
                const filteredCategories = category
                    ? { [category]: sortedModels[category] }
                    : sortedModels;
                const embedData = [];
                let pageContent = [];
                Object.keys(filteredCategories).forEach((category) => {
                    const modelsInCategory = filteredCategories[category];
                    modelsInCategory.forEach((id, index) => {
                        pageContent.push(`${index + 1}. ${id}`);
                        if (pageContent.length === 10 ||
                            index === modelsInCategory.length - 1) {
                            embedData.push({
                                title: `Models - ${ChatAI_1.ChatAI.modelDictionaly[category]}`,
                                description: pageContent.join('\n'),
                                color: discord_js_1.Colors.Aqua,
                            });
                            pageContent = [];
                        }
                    });
                });
                const pagination = new Pagination_1.Pagination({
                    interaction,
                    items: embedData,
                    maxPages: embedData.length,
                });
                yield pagination.build();
            }
            if (cmd === 'chat') {
                const selectedModel = interaction.options.getString('model') || 'gpt-4-turbo-2024-04-09';
                const model = yield ChatAI_1.ChatAI.getModels({ model: selectedModel });
                if (model.length === 0) {
                    return yield create('指定されたモデルが見つかりませんでした');
                }
                const ai = new ChatAI_1.ChatAI({
                    model: model[0].id,
                });
                const response = yield ai.generate({
                    messages: [
                        {
                            role: AIRoles_1.AIRoles.User,
                            content: interaction.options.getString('content', true),
                        },
                    ],
                });
                yield interaction.followUp({
                    embeds: [
                        {
                            description: response,
                            color: discord_js_1.Colors.Green,
                            footer: {
                                text: `${ChatAI_1.ChatAI.modelDictionaly[model[0].owned_by]}(${model[0].id}) | Powered by Voids.top`,
                            },
                        },
                    ],
                });
            }
        }),
        autoComplete: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const models = yield ChatAI_1.ChatAI.getModels();
            const modelIds = models.map((model) => model.id);
            yield interaction.respond(modelIds.map((modelId) => {
                return {
                    name: modelId,
                    value: modelId,
                };
            }));
        }),
    },
});
