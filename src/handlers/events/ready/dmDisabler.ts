import { Event } from '@/handlers/Event';
import { ModuleConfig } from '@/modules/ModuleConfig';
import { client } from '@/index';
import DMDisabler from '@/models/DMDisabler';

async function dmDisabler() {
    const today = new Date().toISOString().split('T')[0];
    const guilds = (await client.guilds.fetch())
        .map((g) => client.guilds.cache.get(g.id))
        .filter((g): g is NonNullable<typeof g> => g !== undefined);

    const data = await DMDisabler.findOne();
    if (!data || data.lastExecute.toISOString().split('T')[0] !== today) {
        if (!data) {
            await DMDisabler.create({
                lastExecute: new Date(),
            });
        } else {
            data.lastExecute = new Date();
            await data.save();
        }

        for (const guild of guilds) {
            const moduleConfig = new ModuleConfig(guild, 'dm_disabler');
            const state = await moduleConfig.isEnabled();

            if (!state) continue;

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            await guild.setIncidentActions({
                dmsDisabledUntil: tomorrow.toISOString(),
                invitesDisabledUntil: null,
            });
        }
    }
}

export default new Event('ready', async () => {
    await dmDisabler();
    setInterval(dmDisabler, 1000 * 60 * 60);
});
