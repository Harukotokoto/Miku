import { Event } from '@/handlers/Event';
import { RoleKeeper } from '@/modules/RoleKeeper';
import { GuildMember } from 'discord.js';

export default new Event('guildMemberRemove', async (member) => {
    if (!(await RoleKeeper.isEnabled(member.guild))) return;

    const roleKeeper = new RoleKeeper(member as GuildMember);

    await roleKeeper.saveRoles();
});
