import {
  ApplicationCommandData,
  ApplicationCommandType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Message,
  MessageContextMenuCommandInteraction,
  PermissionResolvable,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { Miku } from '@/libraries/Classes/Miku';

type MessageExecuteType = ({
  client,
  message,
  args,
}: {
  client: Miku;
  message: Message;
  args: string[];
}) => any;

type AutoCompleteExecuteType = ({
  client,
  interaction,
}: {
  client: Miku;
  interaction: AutocompleteInteraction;
}) => any;

type CommandBase = {
  requiredPermissions?: PermissionResolvable[];
  ephemeral?: boolean;
  aliases?: string[];
  isOwnerCommand?: boolean;
};

type Command<
  T extends
    | ApplicationCommandType.ChatInput
    | ApplicationCommandType.Message
    | ApplicationCommandType.User,
> = {
  type: T;
  execute: {
    interaction?: ({
      client,
      interaction,
    }: {
      client: Miku;
      interaction: T extends ApplicationCommandType.ChatInput
        ? ChatInputCommandInteraction
        : T extends ApplicationCommandType.Message
          ? MessageContextMenuCommandInteraction
          : UserContextMenuCommandInteraction;
    }) => any;
    message?: MessageExecuteType;
    autoComplete?: AutoCompleteExecuteType;
  };
};

type CommandWithDefault = {
  type?: never;
  execute: {
    interaction?: ({
      client,
      interaction,
    }: {
      client: Miku;
      interaction: ChatInputCommandInteraction;
    }) => any;
    message?: MessageExecuteType;
    autoComplete?: AutoCompleteExecuteType;
  };
};

export type CommandType = CommandBase &
  ApplicationCommandData &
  (
    | (
        | Command<ApplicationCommandType.ChatInput>
        | Command<ApplicationCommandType.Message>
        | Command<ApplicationCommandType.User>
      )
    | CommandWithDefault
  );
