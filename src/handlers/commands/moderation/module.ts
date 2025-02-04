import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { ModuleConfig } from '@/modules/ModuleConfig';

const modules = [
    {
        name: 'leveling',
        value: 'leveling',
    },
];

export default new Command({
    name: 'module',
    description: 'モジュールの有効化/無効化を切り替えます',
    requiredPermissions: ['Administrator'],
    options: [
        {
            name: 'enable',
            description: 'モジュールを有効化します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'module',
                    description: '有効化するモジュール',
                    choices: modules,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'disable',
            description: 'モジュールを無効化します',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'module',
                    description: '無効化するモジュール',
                    choices: modules,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const cmd = interaction.options.getSubcommand();

            if (!interaction.guild) return;

            const moduleId = interaction.options.getString('module', true);
            const module = new ModuleConfig(interaction.guild, moduleId);

            if (cmd === 'enable') {
                await module.enable();

                await interaction.followUp({
                    embeds: [
                        {
                            description: `\`${moduleId}\`を有効化しました`,
                            color: Colors.Green,
                            footer: client.footer(),
                        },
                    ],
                });
            } else if (cmd === 'disable') {
                await module.disable();

                await interaction.followUp({
                    embeds: [
                        {
                            description: `\`${moduleId}\`を無効化しました`,
                            color: Colors.Red,
                            footer: client.footer(),
                        },
                    ],
                });
            }
        },
    },
});
