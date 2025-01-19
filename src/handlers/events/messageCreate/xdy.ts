import { Event } from '@/handlers/Event';
import { rollDice } from '@/libraries/Functions/rollDice';
import { Colors } from 'discord.js';
import { client } from '@/index';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;

    const regex = /^(\d+)d(\d+)$/i;
    const match = message.content.match(regex);

    if (match) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);

        if (x <= 0 || y <= 0 || x > 100) {
            await message.reply({
                embeds: [
                    {
                        description:
                            'サイコロの個数は1~100の範囲、面数は1以上の正数で指定してください。',
                        color: Colors.Red,
                        footer: client.footer(),
                    },
                ],
            });
            return;
        }

        const rolls = rollDice(x, y);
        const total = rolls.reduce((a, b) => a + b, 0);

        await message.reply({
            embeds: [
                {
                    title: `${x}D${y}`,
                    description:
                        rolls.length === 1
                            ? `--> ${total}`
                            : `${rolls.join(', ')} --> ${total}`,
                    color: Colors.Blue,
                    footer: client.footer(),
                },
            ],
        });
    }
});
