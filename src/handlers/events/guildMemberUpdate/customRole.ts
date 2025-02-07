import { Event } from '@/handlers/Event';
import { CustomRole } from '@/modules/CustomRole';
import { Colors } from 'discord.js';

export default new Event('guildMemberUpdate', async (oldMember, newMember) => {
    if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

    const customRole = new CustomRole(newMember.guild);

    if (!(await customRole.hasCustomRole(newMember))) return;

    const requiredRoleId = await customRole.getRequiredRole();
    const requiredRole = newMember.guild.roles.cache.get(requiredRoleId || '');
    if (!requiredRole) return;

    if (
        (await customRole.allowAdminBypass()) &&
        newMember.permissions.has('Administrator')
    )
        return;

    if (!newMember.roles.cache.has(requiredRole.id)) {
        await customRole.removeCustomRole(newMember);

        try {
            await newMember.send({
                embeds: [
                    {
                        description:
                            '必須ロールが削除されたため、カスタムロールも削除されました',
                        color: Colors.Blue,
                        footer: {
                            text: newMember.guild.name,
                            icon_url: newMember.guild.iconURL() || undefined,
                        },
                    },
                ],
            });
        } catch (error) {
            return;
        }
    }
});
