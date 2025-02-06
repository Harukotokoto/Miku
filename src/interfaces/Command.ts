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
}) => Promise<void>;

type AutoCompleteExecuteType = ({
    client,
    interaction,
}: {
    client: Miku;
    interaction: AutocompleteInteraction;
}) => Promise<void>;

type CommandBase = {
    requiredPermissions?: PermissionResolvable[];
    ephemeral?: boolean;
    aliases?: string[];
    isOwnerCommand?: boolean;
    userInstall?: boolean;
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
        }) => Promise<void>;
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
        }) => Promise<void>;
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
