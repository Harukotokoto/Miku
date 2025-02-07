import { APIRole, Attachment, Guild, GuildMember, Role } from 'discord.js';
import { RegisterCustomRole } from '@/interfaces/RegisterCustomRole';
import customRoleSettings from '@/models/CustomRoleSettings';
import { CreateCustomRoleOptions } from '@/interfaces/CreateCustomRoleOptions';
import customRole from '@/models/CustomRole';

export class CustomRole {
    constructor(private guild: Guild) {}

    public async registerCustomRole(options: RegisterCustomRole) {
        const { anchorRole, requiredRole, options: registerOptions } = options;
        const data = await customRoleSettings.findOne({
            guildId: this.guild.id,
        });

        if (data) {
            throw new Error('カスタムロールは既に登録されています。');
        }

        const newSettings = new customRoleSettings({
            guildId: this.guild.id,
            anchorRoleId: anchorRole.id,
            requiredRoleId: requiredRole?.id,
            options: registerOptions,
        });

        await newSettings.save();

        return newSettings;
    }

    public async unregisterCustomRole() {
        const data = await customRoleSettings.findOne({
            guildId: this.guild.id,
        });

        if (!data) {
            throw new Error('カスタムロールは登録されていません');
        }

        await customRoleSettings.deleteOne({
            guildId: this.guild.id,
        });
    }

    public async setAnchorRole(anchorRole: Role | APIRole) {
        const settings = await customRoleSettings.findOne({
            guildId: this.guild.id,
        });

        if (!settings) {
            throw new Error('カスタムロールが設定されていません。');
        }

        settings.anchorRoleId = anchorRole.id;
        await settings.save();
    }

    public async setRequiredRole(requiredRole: Role | APIRole) {
        const settings = await customRoleSettings.findOne({
            guildId: this.guild.id,
        });

        if (!settings) {
            throw new Error('カスタムロールが設定されていません。');
        }

        settings.requiredRoleId = requiredRole.id;
        await settings.save();
    }

    public async setOptions(options: RegisterCustomRole['options']) {
        const settings = await customRoleSettings.findOne({
            guildId: this.guild.id,
        });

        if (!settings) {
            throw new Error('カスタムロールが設定されていません。');
        }

        settings.options = options;
        await settings.save();
    }

    public async createCustomRole(
        member: GuildMember,
        options: CreateCustomRoleOptions,
    ) {
        const settings = await customRoleSettings.findOne({
            guildId: this.guild.id,
        });

        if (!settings) {
            throw new Error('カスタムロールは設定されていません。');
        }

        const memberData = await customRole.findOne({
            guildId: this.guild.id,
            userId: member.id,
        });

        if (memberData) {
            throw new Error('既にカスタムロールを所持しています。');
        }

        if (
            !(
                settings.options.allowAdminBypass &&
                member.permissions.has('Administrator')
            ) &&
            settings.requiredRoleId
        ) {
            const requiredRole = await this.guild.roles.fetch(
                settings.requiredRoleId,
            );
            if (!requiredRole) {
                throw new Error(
                    '必須ロールとして設定されているロールが見つかりませんでした。',
                );
            }

            if (!member.roles.cache.has(requiredRole.id)) {
                throw new Error(
                    `カスタムロールを作成するには${requiredRole}を所持している必要があります。`,
                );
            }
        }

        const anchorRole = await this.guild.roles.fetch(settings.anchorRoleId);
        if (!anchorRole) {
            throw new Error(
                'アンカーとして設定されているロールが見つかりませんでした。',
            );
        }

        const me = await this.guild.members.fetch(this.guild.client.user.id);
        if (!me.permissions.has('ManageRoles')) {
            throw new Error('Botに必要な権限が不足しています: `MANAGE_ROLES`');
        }

        if (me.roles.highest.comparePositionTo(anchorRole) < 0) {
            throw new Error(
                'アンカーとして設定されているロールよりBotのロールを上げる必要があります',
            );
        }

        if (
            options.color &&
            !/^[0-9A-Fa-f]{6}$/i.test(options.color.replace('#', ''))
        ) {
            throw new Error('無効なHexCodeです。');
        }

        const role = await this.guild.roles.create({
            name: options.name,
            color: options.color ? parseInt(options.color, 16) : 0,
            icon: options.attachment?.url,
            position: anchorRole.position,
        });

        await member.roles.add(role);

        const newCustomRole = new customRole({
            guildId: this.guild.id,
            userId: member.id,
            roleId: role.id,
        });

        await newCustomRole.save();

        return role;
    }

    public async removeCustomRole(member: GuildMember) {
        const data = await customRole.findOne({
            guildId: this.guild.id,
            userId: member.id,
        });

        if (!data) {
            throw new Error('カスタムロールを所有していません。');
        }

        const role = await this.guild.roles.fetch(data.roleId);
        if (!role) {
            await customRole.deleteMany({
                roleId: data.roleId,
            });

            throw new Error('ロールが見つかりませんでした。');
        }

        const me = await this.guild.members.fetch(this.guild.client.user.id);
        if (!me.permissions.has('ManageRoles')) {
            throw new Error('Botに必要な権限が不足しています: `MANAGE_ROLES`');
        }

        if (me.roles.highest.comparePositionTo(role) <= 0) {
            throw new Error('ロールを削除することができません。');
        }

        await role.delete('カスタムロール削除リクエストによる削除');

        await customRole.deleteMany({
            roleId: role.id,
        });
    }

    public async setName(member: GuildMember, name: string) {
        const data = await customRole.findOne({
            guildId: this.guild.id,
            userId: member.id,
        });

        if (!data) {
            throw new Error('カスタムロールを作成してください。');
        }

        const role = await this.guild.roles.fetch(data.roleId);
        if (!role) {
            await customRole.deleteMany({
                roleId: data.roleId,
            });

            throw new Error('カスタムロールが見つかりませんでした。');
        }

        const me = await this.guild.members.fetch(this.guild.client.user.id);
        if (!me.permissions.has('ManageRoles')) {
            throw new Error('Botに必要な権限が不足しています: `MANAGE_ROLES`');
        }

        if (me.roles.highest.comparePositionTo(role) < 0) {
            throw new Error('ロール設定を変更することができません。');
        }

        await role.setName(name);
    }

    public async setColor(member: GuildMember, color?: string) {
        const data = await customRole.findOne({
            guildId: this.guild.id,
            userId: member.id,
        });

        if (!data) {
            throw new Error('カスタムロールを作成してください。');
        }

        const role = await this.guild.roles.fetch(data.roleId);
        if (!role) {
            await customRole.deleteMany({
                roleId: data.roleId,
            });

            throw new Error('カスタムロールが見つかりませんでした。');
        }

        const me = await this.guild.members.fetch(this.guild.client.user.id);
        if (!me.permissions.has('ManageRoles')) {
            throw new Error('Botに必要な権限が不足しています: `MANAGE_ROLES`');
        }

        if (me.roles.highest.comparePositionTo(role) < 0) {
            throw new Error('ロール設定を変更することができません。');
        }

        if (color && !/^[0-9A-Fa-f]{6}$/i.test(color.replace('#', ''))) {
            throw new Error('無効なHexCodeです。');
        }

        await role.setColor(color ? parseInt(color, 16) : 0);
    }

    public async setIcon(member: GuildMember, icon?: Attachment) {
        const data = await customRole.findOne({
            guildId: this.guild.id,
            userId: member.id,
        });

        if (!data) {
            throw new Error('カスタムロールを作成してください。');
        }

        const role = await this.guild.roles.fetch(data.roleId);
        if (!role) {
            await customRole.deleteMany({
                roleId: data.roleId,
            });

            throw new Error('カスタムロールが見つかりませんでした。');
        }

        const me = await this.guild.members.fetch(this.guild.client.user.id);
        if (!me.permissions.has('ManageRoles')) {
            throw new Error('Botに必要な権限が不足しています: `MANAGE_ROLES`');
        }

        if (me.roles.highest.comparePositionTo(role) > 0) {
            throw new Error('ロール設定を変更することができません。');
        }

        await role.setIcon(icon?.url || '');
    }
}
