import { NewsChannel, TextChannel } from 'discord.js';

export interface ReactionRoleOptions {
    channel: TextChannel | NewsChannel;
    title?: string | null;
    description?: string | null;
}
