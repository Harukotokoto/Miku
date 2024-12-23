import { Command } from '@/handlers/Command';
import { APIEmbed, ApplicationCommandOptionType, Colors } from 'discord.js';
import { ChatAI } from '@/libraries/Classes/Modules/ChatAI';
import { ModelCategories } from '@/libraries/Enums/ModelCategories';
import { CommandError } from '@/handlers/CommandError';
import { Pagination } from '@/libraries/Classes/Utils/Pagination';

export default new Command({
  name: 'chatai',
  description: 'AIと会話します',
  options: [
    {
      name: 'models',
      description: '使用可能なModelを一覧表示します',
      type: ApplicationCommandOptionType.Subcommand,
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
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const cmd = interaction.options.getSubcommand();
      const { create } = new CommandError(interaction);

      if (cmd === 'models') {
        const category = interaction.options.getString(
          'category',
        ) as ModelCategories;

        const models = category
          ? await ChatAI.getModels({ category })
          : await ChatAI.getModels();

        const sortedModels = models.reduce(
          (acc, model) => {
            if (!acc[model.owned_by]) {
              acc[model.owned_by] = [];
            }
            acc[model.owned_by].push(model.id);
            return acc;
          },
          {} as Record<string, string[]>,
        );

        const filteredCategories = category
          ? { [category]: sortedModels[category] }
          : sortedModels;

        const embedData: APIEmbed[] = [];
        let pageContent: string[] = [];

        Object.keys(filteredCategories).forEach((category) => {
          const modelsInCategory = filteredCategories[category];
          modelsInCategory.forEach((id, index) => {
            pageContent.push(`${index + 1}. ${id}`);
            if (
              pageContent.length === 10 ||
              index === modelsInCategory.length - 1
            ) {
              const modelDictionaly: Record<string, string> = {
                openai: 'ChatGPT',
                'x.ai': 'Grok',
                anthropic: 'Claude',
                google: 'Gemini',
              };
              embedData.push({
                title: `Models - ${modelDictionaly[category]}`,
                description: pageContent.join('\n'),
                color: Colors.Aqua,
              });
              pageContent = [];
            }
          });
        });

        const pagination = new Pagination({
          interaction,
          items: embedData,
          maxPages: embedData.length,
        });

        await pagination.build();
      }
    },
  },
});
