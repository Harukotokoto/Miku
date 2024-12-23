import { Command } from '@/handlers/Command';
import { APIEmbed, ApplicationCommandOptionType, Colors } from 'discord.js';
import { ChatAI } from '@/libraries/Classes/Modules/ChatAI';
import { ModelCategories } from '@/libraries/Enums/ModelCategories';
import { CommandError } from '@/handlers/CommandError';
import { Pagination } from '@/libraries/Classes/Utils/Pagination';
import { AIRoles } from '@/libraries/Enums/AIRoles';
import { Emoji } from '@/libraries/Enums/Emoji';

export default new Command({
  name: 'chatai',
  description: 'AIと会話します',
  contexts: [
    InteractionContextType.PrivateChannel,
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
  ],
  integrationTypes: [
    ApplicationIntegrationType.UserInstall,
    ApplicationIntegrationType.GuildInstall,
  ],
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
    {
      name: 'chat',
      description: 'AIと会話します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'content',
          type: ApplicationCommandOptionType.String,
          description: '内容',
          required: true,
        },
        {
          name: 'model',
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          description: '使用するモデル',
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
              embedData.push({
                title: `Models - ${ChatAI.modelDictionaly[category]}`,
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

      if (cmd === 'chat') {
        const selectedModel =
          interaction.options.getString('model') || 'gpt-4-turbo-2024-04-09';
        const model = await ChatAI.getModels({ model: selectedModel });
        if (model.length === 0) {
          return await create('指定されたモデルが見つかりませんでした');
        }

        await interaction.followUp({
          embeds: [
            {
              description: `${Emoji.Loading} 生成中です...`,
              color: Colors.Yellow,
              footer: {
                text: `${ChatAI.modelDictionaly[model[0].owned_by]} (${model[0].id}) | Powered by Voids API`,
              },
            },
          ],
        });

        const ai = new ChatAI({
          model: model[0].id,
        });

        const response = await ai.generate({
          messages: [
            {
              role: AIRoles.User,
              content: interaction.options.getString('content', true),
            },
          ],
        });

        await interaction.editReply({
          embeds: [
            {
              description: response,
              color: Colors.Green,
              footer: {
                text: `${ChatAI.modelDictionaly[model[0].owned_by]} (${model[0].id}) | Powered by Voids API`,
              },
            },
          ],
        });
      }
    },
    autoComplete: async ({ client, interaction }) => {
      const models = await ChatAI.getModels();
      const modelIds = models.map((model) => model.id);

      await interaction.respond(
        modelIds.map((modelId) => {
          return {
            name: modelId,
            value: modelId,
          };
        }),
      );
    },
  },
});
