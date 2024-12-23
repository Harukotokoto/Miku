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
const ModelCategories_1 = require("../../../libraries/Enums/ModelCategories");
const CommandError_1 = require("../../../libraries/Classes/Handlers/CommandError");
const Pagination_1 = require("../../../libraries/Classes/Utils/Pagination");
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
    ],
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            const cmd = interaction.options.getSubcommand();
            const { create } = new CommandError_1.CommandError(interaction);
            if (cmd === 'models') {
                const category = interaction.options.getString('category');
                // モデルの取得
                const models = category
                    ? yield ChatAI_1.ChatAI.getModels({ category }) // カテゴリが指定されていればそのカテゴリのみ取得
                    : yield ChatAI_1.ChatAI.getModels(); // カテゴリが指定されていなければ全て取得
                // モデルをカテゴリごとに分類
                const sortedModels = models.reduce((acc, model) => {
                    if (!acc[model.owned_by]) {
                        acc[model.owned_by] = [];
                    }
                    acc[model.owned_by].push(model.id);
                    return acc;
                }, {});
                // カテゴリが存在する場合に絞り込む
                const filteredCategories = category
                    ? { [category]: sortedModels[category] }
                    : sortedModels;
                const embedData = [];
                let pageContent = [];
                // ページネーション用のモデルを作成
                Object.keys(filteredCategories).forEach((category) => {
                    const modelsInCategory = filteredCategories[category];
                    modelsInCategory.forEach((id, index) => {
                        pageContent.push(`${index + 1}. ${id}`);
                        if (pageContent.length === 10 ||
                            index === modelsInCategory.length - 1) {
                            // ModelCategoriesのenumを使用して、カテゴリ名をタイトルに反映
                            embedData.push({
                                title: `Models - ${ModelCategories_1.ModelCategories[category]}`, // Enumを使用してタイトルにカテゴリ名を表示
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
        }),
    },
});
