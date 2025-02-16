import { ChannelType, NewsChannel, TextChannel } from 'discord.js';

export type GuildTextType = TextChannel | NewsChannel;
export const GuildText = ChannelType.GuildText | ChannelType.GuildNews;
