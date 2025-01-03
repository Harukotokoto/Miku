import { client } from '@/index';
import { pin_model } from '@/libraries/Models/pin_message';
import { Event } from '@/handlers/Event';

export default new Event('messageCreate', async (message) => {
    if (!client.pinned_channels.includes(message.channel.id)) return;

    if (message.author.id === client.user?.id) return;

    const pin_data = await pin_model.findOne({ ChannelID: message.channel.id });
    if (!pin_data) return;

    const oldMessage = await message.channel.messages.fetch(
        pin_data.LastMessageID,
    );
    if (!oldMessage) return;

    await oldMessage.delete();

    const msg = await message.channel.send({
        embeds: oldMessage.embeds,
    });

    pin_data.LastMessageID = msg.id;
    await pin_data.save();
});
