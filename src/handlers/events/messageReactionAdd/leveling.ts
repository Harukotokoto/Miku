import { Event } from '@/handlers/Event';

export default new Event('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (
        reaction.message.content?.match(
            /^-# \*\*(.+?)\*\*のレベルが\*\*(\d+)\*\*になりました！$/,
        )
    ) {
        if (reaction.emoji.name === '🗑️') {
            await reaction.message.delete();
        }
    }
});
