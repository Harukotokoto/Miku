import { Command } from '@/handlers/Command';
import { getLibraries } from '@/libraries/Functions/getLibraries';
import { Colors } from 'discord.js';
import { LibraryType } from '@/libraries/Enums/LibraryType';

export default new Command({
    name: 'libraries',
    description: '開発に使用しているライブラリを表示します',
    execute: {
        interaction: async ({ client, interaction }) => {
            try {
                const libraries = getLibraries();

                const description = libraries
                    .map((lib) => {
                        const title =
                            lib.type === LibraryType.dependencies
                                ? '**ライブラリ:**'
                                : '**開発補助ライブラリ:**';

                        const librariesList = lib.libraries
                            .map(
                                (library) =>
                                    `${library.name}: \`${library.version}\``,
                            )
                            .join('\n');

                        return `${title}\n${librariesList}`;
                    })
                    .join('\n\n');

                await interaction.followUp({
                    embeds: [
                        {
                            title: 'ライブラリ一覧',
                            description: description,
                            color: Colors.Blue,
                        },
                    ],
                });
            } catch (error) {
                await interaction.followUp({
                    embeds: [
                        {
                            description: 'ライブラリ一覧を取得できませんでした',
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
    },
});
