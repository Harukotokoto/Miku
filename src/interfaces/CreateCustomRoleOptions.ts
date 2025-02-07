import { Attachment } from 'discord.js';

export interface CreateCustomRoleOptions {
    name: string;
    color?: string;
    attachment?: Attachment;
}
