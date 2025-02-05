import { Event } from '@/handlers/Event';
import { ChannelType } from 'discord.js';
import { AutoPublish } from '@/modules/AutoPublish';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type !== ChannelType.GuildAnnouncement) return;

    const autoPublish = new AutoPublish(message.channel);
    const isEnabled = await autoPublish.isEnabled();

    if (!isEnabled) return;
    if (!message.crosspostable) return;

    await message.crosspost();
});
