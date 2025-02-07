import { Command } from '@/handlers/Command';
import {
    ApplicationIntegrationType,
    Colors,
    ComponentType,
    InteractionContextType,
} from 'discord.js';
import { getCommands } from '@/libraries/Functions/Util/getCommands';

export default new Command({
    name: 'help',
    description: 'コマンドの詳細を表示します',
    contexts: [
        InteractionContextType.PrivateChannel,
        InteractionContextType.BotDM,
        InteractionContextType.Guild,
    ],
    integrationTypes: [
        ApplicationIntegrationType.UserInstall,
        ApplicationIntegrationType.GuildInstall,
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const commands = await getCommands();

            const categories = [
                ...new Set(commands?.map((command) => command.category)),
            ];

            const categoryDictionary: Record<string, string> = {
                ai: 'AI系コマンド',
                auth: '認証系コマンド',
                custom_role: 'カスタムロール',
                dev: '開発者向けコマンド',
                info: '情報系コマンド',
                moderation: '管理系コマンド',
                music: '音楽コマンド',
                reader: '読み上げコマンド',
                secret: '秘密のコマンド',
                util: '便利系コマンド',
            };

            function getCategoryDisplayName(category: string) {
                if (categoryDictionary[category]) {
                    return categoryDictionary[category];
                }
                return category.charAt(0).toUpperCase() + category.slice(1);
            }

            await interaction.followUp({
                embeds: [
                    {
                        title: '📪 Need help?',
                        description:
                            'カテゴリーとコマンドを選択してください\n' +
                            '\n' +
                            `現在のプレフィックス: \`${client.prefix}\`\n` +
                            'スラッシュコマンドも利用可能です。\n' +
                            'エイリアスはチャットコマンドにのみ対応しています。',
                        color: Colors.Gold,
                        footer: client.footer(),
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.StringSelect,
                                options: categories.map((category) => {
                                    const categoryName =
                                        getCategoryDisplayName(category);
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
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.StringSelect,
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

            const collecter = (
                await interaction.fetchReply()
            ).createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
            });

            collecter.on('collect', async (i) => {
                if (!i.isStringSelectMenu()) return;

                if (i.customId === 'category_select') {
                    const selectedCategory = i.values[0];

                    const categoryName =
                        getCategoryDisplayName(selectedCategory);

                    const commandList = commands?.filter(
                        (cmd) => cmd.category === selectedCategory,
                    );

                    await i.update({
                        embeds: [
                            {
                                title: categoryName,
                                fields: commandList?.map((command) => {
                                    return {
                                        name: command.command.name,
                                        value: command.command.description,
                                        inline: true,
                                    };
                                }),
                                color: Colors.Gold,
                                footer: client.footer(),
                            },
                        ],
                        components: [
                            {
                                type: ComponentType.ActionRow,
                                components: [
                                    {
                                        type: ComponentType.StringSelect,
                                        options: categories.map((category) => {
                                            const categoryName =
                                                getCategoryDisplayName(
                                                    category,
                                                );

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
                                type: ComponentType.ActionRow,
                                components: [
                                    {
                                        type: ComponentType.StringSelect,
                                        options: commands
                                            .filter(
                                                (command) =>
                                                    command.category ===
                                                    selectedCategory,
                                            )
                                            .map((command) => {
                                                return {
                                                    label:
                                                        '/' +
                                                        command.command.name,
                                                    value: command.command.name,
                                                    description:
                                                        command.command
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
                    const cmd = commands?.find(
                        (cmd) => cmd.command.name === selectedCommand,
                    );
                    const command = cmd?.command;

                    if (!command) return;

                    const commandName =
                        command.name.charAt(0).toUpperCase() +
                        command.name.slice(1);
                    const aliases = command.aliases
                        .map((alias: string) => '`' + alias + '`')
                        .join(', ');
                    const commandDescription = command.description;
                    const commandUsage = command.usage;
                    const isOwnerCommand = command.isOwnerCommand;
                    const categoryName = getCategoryDisplayName(cmd?.category);

                    i.update({
                        embeds: [
                            {
                                title: cmd?.category
                                    ? categoryName + ' - ' + commandName
                                    : commandName,
                                description:
                                    commandDescription +
                                    '\n' +
                                    (isOwnerCommand
                                        ? '```fix\n※このコマンドは管理者限定です\n```'
                                        : ''),
                                fields: [
                                    {
                                        name: 'エイリアス',
                                        value:
                                            aliases ||
                                            'このコマンドにエイリアスは設定されていません',
                                    },
                                    {
                                        name: '使用方法',
                                        value: `\`\`\`\n${commandUsage}\n\`\`\``,
                                    },
                                ],
                                color: Colors.Gold,
                                footer: client.footer(),
                            },
                        ],
                    });
                }
            });
        },
    },
});
