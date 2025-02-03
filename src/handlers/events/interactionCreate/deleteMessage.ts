import { Event } from '@/handlers/Event';

export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'delete-message') {
        await interaction.message.delete();
    }
});
