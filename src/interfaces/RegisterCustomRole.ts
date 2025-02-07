import { APIRole, Role } from 'discord.js';

interface RegisterCustomRoleOptions {
    allowAdminBypass?: boolean;
}

export interface RegisterCustomRole {
    anchorRole: Role | APIRole;
    requiredRole?: Role | APIRole;
    options: RegisterCustomRoleOptions;
}
