import autoPublish from '@/models/AutoPublish';
import { ChannelType, NewsChannel } from 'discord.js';

export class AutoPublish {
    private channel: NewsChannel;

    constructor(channel: NewsChannel) {
        this.channel = channel;
    }

    public async setAutoPublish(isEnabled: boolean) {
        const data = await autoPublish.findOne({ channelId: this.channel.id });

        if (!data) {
            const newData = new autoPublish({
                channelId: this.channel.id,
                isEnabled,
            });
            await newData.save();
        } else {
            data.isEnabled = isEnabled;
            await data.save();
        }
    }

    public async isEnabled() {
        const data = await autoPublish.findOne({ channelId: this.channel.id });
        if (!data) return false;

        return data.isEnabled;
    }
}
