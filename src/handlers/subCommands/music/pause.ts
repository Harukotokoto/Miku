import { Miku } from '@/libraries/Classes/Miku';
import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { useTimeline } from 'discord-player';

export async function pause({
    client,
    interaction,
}: {
    client: Miku;
    interaction: ChatInputCommandInteraction;
}) {
    if (!interaction.guild) return;
    const timeline = useTimeline({
        node: interaction.guild,
    });

    if (!timeline) {
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

    const wasPaused = timeline.paused;

    wasPaused ? timeline.resume() : timeline.pause();

    return await interaction.followUp({
        embeds: [
            {
                description: `楽曲の再生を${wasPaused ? '再開' : '一時停止'}しました`,
                color: Colors.Blue,
                footer: client.footer(),
            },
        ],
    });
}
