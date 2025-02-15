import { PaginationOptions } from '@/interfaces/PaginationOptions';
import {
    ActionRowData,
    APIEmbed,
    ButtonComponentData,
    ButtonStyle,
    CommandInteraction,
    ComponentType,
} from 'discord.js';

export class Pagination {
    private interaction: CommandInteraction;
    private readonly items: APIEmbed[];
    private readonly maxPages: number;
    private currentPage = 0;

    /**
     * PaginationOptionsを使用してPaginationのインスタンスを初期化します。
     *
     * @param {Object} options - ページネーションのオプションオブジェクト。
     * @param {Object} options.interaction - インタラクションオブジェクト。
     * @param {Array} options.items - ページネーション対象のアイテム一覧。
     * @param {number} options.maxPages - 最大ページ数。
     * @return {Pagination} 新しく生成されたPaginationインスタンス。
     */
    constructor({ interaction, items, maxPages }: PaginationOptions) {
        this.interaction = interaction;
        this.items = items;
        this.maxPages = maxPages;
    }

    /**
     * 指定されたページ番号に基づいて埋め込みデータとコンポーネントを取得します。
     *
     * @param {number} page ページ番号（0から始まるインデックス形式）
     * @return {Object} 埋め込みデータとボタンコンポーネントを含むオブジェクト
     */
    private getPage(page: number) {
        const embed = this.items[page];
        const totalPages = this.maxPages;

        const components: ActionRowData<ButtonComponentData>[] = [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Primary,
                        label: '前のページ',
                        customId: 'previous',
                        disabled: page === 0,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Primary,
                        label: '次のページ',
                        customId: 'next',
                        disabled: page === totalPages - 1,
                    },
                ],
            },
        ];

        return { embed, components };
    }

    public async build() {
        const { embed, components } = this.getPage(this.currentPage);

        const message = await this.interaction.followUp({
            embeds: [embed],
            components: components,
            fetchReply: true,
        });

        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === this.interaction.user.id,
            time: 60000, // 60秒
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'previous') {
                this.currentPage = Math.max(0, this.currentPage - 1);
            } else if (i.customId === 'next') {
                this.currentPage = Math.min(
                    this.maxPages - 1,
                    this.currentPage + 1,
                );
            }

            const { embed, components } = this.getPage(this.currentPage);
            await i.update({
                embeds: [embed],
                components: components,
            });
        });

        collector.on('end', async () => {
            const disabledComponents = components.map((actionRow) => ({
                ...actionRow,
                components: actionRow.components.map((button) => ({
                    ...button,
                    disabled: true,
                })),
            }));

            await message.edit({
                components: disabledComponents,
            });
        });
    }
}
