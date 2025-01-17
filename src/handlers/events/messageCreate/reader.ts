import { Event } from '@/handlers/Event';
import { Voicevox } from '@/modules/Voicevox';
import { client } from '@/index';
import {
    AudioPlayerStatus,
    createAudioPlayer,
    NoSubscriberBehavior,
} from '@discordjs/voice';
import { convertCleanMessage } from '@/libraries/Functions/Reader/convertCleanMessage';
import { playAudio } from '@/libraries/Functions/Reader/playAudio';
import { unlinkSync } from 'fs';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;

    if (!client.readerChannels.get(guildId)) return;
    if (client.readerChannels.get(guildId) !== message.channel.id) return;

    const filepath = `./sounds/${message.id}.wav`;

    const voicevox = new Voicevox({ defaultSpeaker: 6 });
    await voicevox.generateAudio({
        text: convertCleanMessage(message.cleanContent),
        path: filepath,
    });

    if (!client.guildAudioQueues.has(guildId)) {
        client.guildAudioQueues.set(guildId, {
            queue: [],
            currentFilepath: null,
            player: createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            }),
        });

        const guildQueue = client.guildAudioQueues.get(guildId)!;

        guildQueue.player.on('stateChange', (oldState, newState) => {
            if (
                oldState.status !== AudioPlayerStatus.Idle &&
                newState.status === AudioPlayerStatus.Idle
            ) {
                if (guildQueue.currentFilepath) {
                    unlinkSync(guildQueue.currentFilepath);
                    guildQueue.currentFilepath = null;
                }
                const nextFilepath = guildQueue.queue.shift();
                if (nextFilepath) {
                    guildQueue.currentFilepath = nextFilepath;
                    playAudio(guildId, nextFilepath, guildQueue.player);
                } else {
                    guildQueue.isPlaying = false;
                }
            }
        });
    }

    const guildQueue = client.guildAudioQueues.get(guildId)!;

    guildQueue.queue.push(filepath);
    if (!guildQueue.currentFilepath) {
        guildQueue.currentFilepath = filepath;
    }

    if (!guildQueue.isPlaying) {
        guildQueue.isPlaying = true;
        const nextFilepath = guildQueue.queue.shift();
        if (nextFilepath) {
            await playAudio(guildId, nextFilepath, guildQueue.player);
        }
    }
});
