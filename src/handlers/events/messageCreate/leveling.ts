import { Event } from '@/handlers/Event';
import { Leveling } from '@/modules/Leveling';
import { ButtonStyle, Colors, ComponentType } from 'discord.js';
import { client } from '@/index';
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
        await message.reply(`-# **${message.author.displayName}**のレベルが**${afterLevel.level}**になりました！`);
    }
});
