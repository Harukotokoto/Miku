import { Message, OmitPartialGroupDMChannel, PartialMessage } from 'discord.js';

type Msg = OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>;

interface RegisterDeleteMessageOptions {
    type: 'delete';
    message: Msg;
    newMessage?: never;
}

interface RegisterEditMessageOptions {
    type: 'edit';
    message: Msg;
    newMessage: Msg;
}

export type RegisterMessageOptions =
    | RegisterDeleteMessageOptions
    | RegisterEditMessageOptions;
