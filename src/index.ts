import { Miku } from '@/libraries/Classes/Miku';
import { Colors, IntentsBitField } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { play } from '@/libraries/subCommands/music/play';

export const client = new Miku({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    allowedMentions: {
        repliedUser: false,
    },
    debugMode: false,
    admins: [
        '1004365048887660655',
        '957885295251034112',
        '1301893603328786464',
    ],
    prefix: 'm.',
    onReady: async () => {
        await player.extractors.register(YoutubeiExtractor, {});
    },
});

export const player = new Player(client);

client.run();

player.events.on('playerError', async (queue, error) => {
    if (!queue.metadata) {
        return client.logger.error(error.stack || error.message);
    }

    await queue.metadata.send({
        embeds: [
            {
                title: '再生中にエラーが発生しました',
                description: `\`\`\`\n${error.message}\n\`\`\``,
                color: Colors.Red,
                footer: client.footer(),
            },
        ],
    });
});

player.events.on('playerStart', async (queue, track) => {
    if (!queue.metadata) {
        throw new Error('Metadetaが見つかりませんでした');
    }

    await queue.metadata.send({
        embeds: [
            {
                title: '🎵 再生中 🎵',
                description: `${track.title} - ${track.author}`,
                image: {
                    url: track.thumbnail,
                },
                color: Colors.Blue,
                footer: client.footer(),
            },
        ],
    });
});

player.events.on('playerFinish', async (queue) => {
    if (!queue.metadata) {
        throw new Error('Metadetaが見つかりませんでした');
    }

    await queue.metadata.send({
        embeds: [
            {
                description: 'すべての楽曲の再生が終了しました',
                color: Colors.Blue,
                footer: client.footer(),
            },
        ],
    });
});

process.on('unhandledRejection', (err) => {
    client.logger.error(err as string);
});

process.on('uncaughtException', (err) => {
    client.logger.error(err.message);
});
