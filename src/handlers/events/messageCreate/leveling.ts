import { Event } from '@/handlers/Event';
import { Leveling } from '@/modules/Leveling';
import { ButtonStyle, Colors, ComponentType } from 'discord.js';
import { client } from '@/index';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const leveling = new Leveling(message.author, message.guild);

    const beforeLevel = await leveling.getInfo();

    if (await leveling.isCoolTime()) return;

    await leveling.giveXp();

    const afterLevel = await leveling.getInfo();

    if (beforeLevel.level < afterLevel.level) {
        await message.reply({
            embeds: [
                {
                    description: `${message.author}のレベルが**${afterLevel.level}**になりました！`,
                    color: Colors.Gold,
                    footer: client.footer(),
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Primary,
                            label: 'メッセージを削除',
                            customId: 'delete-message',
                        },
                    ],
                },
            ],
        });
    }
});
