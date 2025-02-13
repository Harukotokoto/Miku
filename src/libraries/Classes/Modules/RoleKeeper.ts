import { Guild, GuildMember } from 'discord.js';
import savedRoles from '@/models/SavedRoles';
import { ModuleConfig } from '@/modules/ModuleConfig';
import { client } from '@/index';

export class RoleKeeper {
    public member: GuildMember;

    public constructor(member: GuildMember) {
        this.member = member;
    }

    public async saveRoles() {
        const roles = this.member.roles.cache.map((r) => r.id);

        const data = await savedRoles.findOne({
            guildId: this.member.guild.id,
            memberId: this.member.id,
        });

        if (!data) {
            const newData = new savedRoles({
                guildId: this.member.guild.id,
                memberId: this.member.id,
                roles,
            });

            await newData.save();

            return;
        }

        data.roles = roles;

        await data.save();
    }

    public async giveRoles() {
        const data = await savedRoles.findOne({
            guildId: this.member.guild.id,
            memberId: this.member.id,
        });

        if (!data) return;

        for (const r of data.roles) {
            const role = await this.member.guild.roles.fetch(r);
            if (!role) continue;

            if (role.id === this.member.guild.id) continue;
            if (this.member.roles.cache.has(role.id)) continue;

            const me = await this.member.guild.members.fetch(
                client.user?.id as string,
            );
            if (me.roles.highest.comparePositionTo(role) <= 0) continue;

            await this.member.roles.add(role);
        }

        await savedRoles.deleteOne({
            guildId: this.member.guild.id,
            memberId: this.member.id,
        });
    }

    public static async isEnabled(guild: Guild) {
        const module = new ModuleConfig(guild, 'role_keeper');

        return await module.isEnabled(false);
    }
}
