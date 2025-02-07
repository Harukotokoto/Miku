import { Message, PartialMessage } from 'discord.js';

interface RegisterDeleteMessageOptions {
    type: 'delete';
    message: Message | PartialMessage;
    newMessage?: never;
}

interface RegisterEditMessageOptions {
    type: 'edit';
    message: Message | PartialMessage;
    newMessage: Message | PartialMessage;
}

export type RegisterMessageOptions =
    | RegisterDeleteMessageOptions
    | RegisterEditMessageOptions;
