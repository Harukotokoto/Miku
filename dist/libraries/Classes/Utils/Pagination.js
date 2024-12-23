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
exports.Pagination = void 0;
const discord_js_1 = require("discord.js");
class Pagination {
    constructor({ interaction, items, maxPages }) {
        this.currentPage = 0;
        this.interaction = interaction;
        this.items = items;
        this.maxPages = maxPages;
    }
    getPage(page) {
        const embed = this.items[page];
        const totalPages = this.maxPages;
        const components = [
            {
                type: discord_js_1.ComponentType.ActionRow,
                components: [
                    {
                        type: discord_js_1.ComponentType.Button,
                        style: discord_js_1.ButtonStyle.Primary,
                        label: '前のページ',
                        customId: 'previous',
                        disabled: page === 0,
                    },
                    {
                        type: discord_js_1.ComponentType.Button,
                        style: discord_js_1.ButtonStyle.Primary,
                        label: '次のページ',
                        customId: 'next',
                        disabled: page === totalPages - 1,
                    },
                ],
            },
        ];
        return { embed, components };
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            const { embed, components } = this.getPage(this.currentPage);
            const message = yield this.interaction.followUp({
                embeds: [embed],
                components: components,
                fetchReply: true,
            });
            const collector = message.createMessageComponentCollector({
                filter: (i) => i.user.id === this.interaction.user.id,
                time: 60000, // 60秒
            });
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId === 'previous') {
                    this.currentPage = Math.max(0, this.currentPage - 1);
                }
                else if (i.customId === 'next') {
                    this.currentPage = Math.min(this.maxPages - 1, this.currentPage + 1);
                }
                const { embed, components } = this.getPage(this.currentPage);
                yield i.update({
                    embeds: [embed],
                    components: components,
                });
            }));
            collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
                const disabledComponents = components.map((actionRow) => (Object.assign(Object.assign({}, actionRow), { components: actionRow.components.map((button) => (Object.assign(Object.assign({}, button), { disabled: true }))) })));
                yield message.edit({
                    components: disabledComponents,
                });
            }));
        });
    }
}
exports.Pagination = Pagination;
