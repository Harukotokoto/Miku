export function extractRoleIds(description: string | null) {
    if (!description) return [];
    const roleIdRegex = /<@&(\d+)>/g;
    const roleIds: string[] = [];
    let match;

    while ((match = roleIdRegex.exec(description)) !== null) {
        roleIds.push(match[1]);
    }

    return roleIds;
}
