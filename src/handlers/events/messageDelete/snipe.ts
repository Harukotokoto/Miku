import { Event } from '@/handlers/Event';
import { Snipe } from '@/modules/Snipe';

export default new Event('messageDelete', async (message) => {
    if (!message.content && !message.attachments) return;
    const snipe = new Snipe(message.channel);

    if (!message.guild) return;

    snipe.setMessage({
        type: 'delete',
        message: message,
    });
});
