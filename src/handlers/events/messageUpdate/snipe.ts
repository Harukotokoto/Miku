import { Event } from '@/handlers/Event';
import { Snipe } from '@/modules/Snipe';

export default new Event('messageUpdate', async (oldMessage, newMessage) => {
    if (!oldMessage.content && !newMessage.attachments) return;
    if (oldMessage.content === newMessage.content) return;

    const snipe = new Snipe(oldMessage.channel);

    snipe.setMessage({
        type: 'edit',
        message: oldMessage,
        newMessage: newMessage,
    });
});
