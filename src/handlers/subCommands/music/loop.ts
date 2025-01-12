import { Miku } from '@/libraries/Classes/Miku';
import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { QueueRepeatMode, useQueue } from 'discord-player';

export async function loop({
    client,
    interaction,
}: {
    client: Miku;
    interaction: ChatInputCommandInteraction;
}) {
    if (!interaction.guild) return;
    const queue = useQueue(interaction.guild);

    if (!queue) {
        return await interaction.followUp({
            embeds: [
                {
                    description: '楽曲が再生されていません',
                    color: Colors.Red,
                    footer: client.footer(),
                },
            ],
        });
    }

    const loopMode: QueueRepeatMode =
        interaction.options.getNumber('mode') ||
        queue.repeatMode === QueueRepeatMode.OFF
            ? QueueRepeatMode.QUEUE
            : QueueRepeatMode.OFF;

    queue.setRepeatMode(loopMode);

    const modeDictionary: Record<QueueRepeatMode, string> = {
        0: 'OFF',
        1: '1曲をループ',
        2: 'キューをループ',
        3: '自動再生',
    };

    return await interaction.followUp({
        embeds: [
            {
                description: `ループ設定を**${modeDictionary[loopMode]}**に設定しました`,
                color: Colors.Red,
                footer: client.footer(),
            },
        ],
    });
}
