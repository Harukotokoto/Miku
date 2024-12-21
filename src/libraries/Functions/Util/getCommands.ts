import { CommandType } from '@/interfaces/Command';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { client } from '@/index';
import { CommandList } from '@/interfaces/CommandList';

export const getCommands = async (): Promise<CommandList[]> => {
  const commands: CommandList[] = [];

  const commandFiles = await client.globPromise(
    `${__dirname}/../../commands/**/*{.ts,.js}`,
  );

  for (const filePath of commandFiles) {
    const parts = filePath.split('/');
    const directoryPath = parts.slice(0, -1).join('/');
    const category = directoryPath.split('/').pop() || 'No Category';

    const command = await client.importFile<CommandType>(filePath);

    if (!command) continue;
    if (command.type && command.type !== ApplicationCommandType.ChatInput)
      continue;
    const commandOptions = command.options?.map((option) => {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        const options =
          option.options
            ?.map((option) => {
              if (option.required) {
                return '<' + option.name + '>';
              } else {
                return '<' + option.name + '?>';
              }
            })
            .join(' ') || '';

        return {
          type: 'withSubCommand',
          value: option.name + ' ' + options,
        };
      } else if (option.type !== ApplicationCommandOptionType.SubcommandGroup) {
        if (option.required) {
          return {
            type: 'Option',
            value: '<' + option.name + '>',
          };
        } else {
          return {
            type: 'Option',
            value: '<' + option.name + '?>',
          };
        }
      }
    });

    const usage = commandOptions
      ? commandOptions?.map((option) => option?.type === 'withSubCommand')
        ? commandOptions
            ?.map((option) => command.name + ' ' + option?.value)
            .join('\n')
        : command.name +
          ' ' +
          commandOptions?.map((option) => option?.value).join(' ')
      : null;

    commands.push({
      category: category,
      command: {
        name: command.name,
        description: command.description,
        aliases: command.aliases || [],
        usage: usage || '/' + command.name,
        isOwnerCommand: !!command.isOwnerCommand,
      },
    });
  }

  return commands;
};
