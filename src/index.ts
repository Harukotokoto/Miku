import { Miku } from '@/libraries/Classes/Miku';
import { Colors, IntentsBitField } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';

export const client = new Miku({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    allowedMentions: {
        repliedUser: false,
    },
    debugMode: false,
    admins: ['1004365048887660655'],
    prefix: 'm.',
    onReady: async () => {
        await player.extractors.register(YoutubeiExtractor, {});
    },
});

export const player = new Player(client);

client.run();

player.events.on('playerError', async (queue, error) => {
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

player.events.on('emptyQueue', async (queue) => {
    await queue.metadata.send({
        embeds: [
            {
                description: 'キュー内のすべての楽曲を再生しました',
                color: Colors.Blue,
                footer: client.footer(),
            },
        ],
    });
});

player.events.on('emptyChannel', async (queue) => {
    await queue.metadata.send({
        embeds: [
            {
                description: '人数が0人になったため再生を終了しました',
                color: Colors.Blue,
                footer: client.footer(),
            },
        ],
    });
});

client.on('error', async (err) => {
    client.logger.error(err.message);
    await client.errorLog.sendErrorLog({
        message: err.message,
    });
});

process.on('unhandledRejection', async (err) => {
    client.logger.error(err as string);
    await client.errorLog.sendErrorLog({
        message: err as string,
    });
});

process.on('uncaughtException', async (err) => {
    client.logger.error(err.message);
    await client.errorLog.sendErrorLog({
        message: err.message,
    });
});
