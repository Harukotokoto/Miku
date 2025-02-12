import { Event } from '@/handlers/Event';
import { RoleKeeper } from '@/modules/RoleKeeper';

export default new Event('guildMemberAdd', async (member) => {
    if (!(await RoleKeeper.isEnabled(member.guild))) return;

    const guildMember = await member.guild.members.fetch(member);
    const roleKeeper = new RoleKeeper(guildMember);

    await roleKeeper.giveRoles();
});
