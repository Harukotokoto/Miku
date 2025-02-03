import { Event } from '@/handlers/Event';
import { Leveling } from '@/modules/Leveling';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const leveling = new Leveling(message.author, message.guild);

    if (await leveling.isCoolTime()) return;

    await leveling.giveXp();
});
