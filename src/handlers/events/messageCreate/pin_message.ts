import { client } from '@/index';
import PinnedMessage from '@/libraries/Models/PinnedMessage';
import { Event } from '@/handlers/Event';

export default new Event('messageCreate', async (message) => {
    if (!client.pinned_channels.includes(message.channel.id)) return;

    if (message.author.id === client.user?.id) return;

    const pin_data = await PinnedMessage.findOne({
        ChannelID: message.channel.id,
    });
    if (!pin_data) return;

    const oldMessage = await message.channel.messages.fetch(
        pin_data.lastMessageId,
    );
    if (!oldMessage) return;

    await oldMessage.delete();

    const msg = await message.channel.send({
        embeds: oldMessage.embeds,
    });

    pin_data.lastMessageId = msg.id;
    await pin_data.save();
});
