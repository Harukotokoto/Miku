import { Event } from '@/handlers/Event';
import { Leveling } from '@/modules/Leveling';
import { ModuleConfig } from '@/modules/ModuleConfig';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const leveling = new Leveling(message.author, message.guild);
    const module = new ModuleConfig(message.guild, 'leveling');
    if (!(await module.isEnabled())) return;

    const beforeLevel = await leveling.getInfo();

    if (await leveling.isCoolTime()) return;

    await leveling.giveXp();

    const afterLevel = await leveling.getInfo();

    if (beforeLevel.level < afterLevel.level) {
        const msg = await message.reply(
            `-# **${message.author.displayName}**のレベルが**${afterLevel.level}**になりました！`,
        );

        await msg.react('🗑️');
    }
});
