import { Command } from '@/handlers/Command';
import {
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    Colors,
    InteractionContextType,
    SnowflakeUtil,
} from 'discord.js';

export default new Command({
    name: 'snowflake',
    description: 'Snowflakeを解析し、情報を出力します',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'snowflake',
            description: '内部ID',
            required: true,
        },
    ],
    contexts: [
        InteractionContextType.PrivateChannel,
        InteractionContextType.BotDM,
        InteractionContextType.Guild,
    ],
    integrationTypes: [
        ApplicationIntegrationType.UserInstall,
        ApplicationIntegrationType.GuildInstall,
    ],
    execute: {
        interaction: async ({ client, interaction }) => {
            const snowflake = interaction.options.getString('snowflake', true);
            const data = SnowflakeUtil.deconstruct(snowflake);

            const id = data.id;
            const timestamp = data.timestamp / BigInt(1000);
            const workerId = data.workerId;
            const processId = data.processId;
            const increment = data.increment;
            const epoch = data.epoch;

            await interaction.followUp({
                embeds: [
                    {
                        title: `Snowflake: ${snowflake} の情報`,
                        description:
                            `**Snowflake:** ${id}\n` +
                            `**作成日:** <t:${timestamp}:F>\n` +
                            `**Worker ID:** ${workerId}\n` +
                            `**Process ID:** ${processId}\n` +
                            `**Increment:** ${increment}\n` +
                            `**Epoch:** ${epoch}`,
                        color: Colors.Purple,
                        footer: client.footer(),
                    },
                ],
            });
        },
    },
});
