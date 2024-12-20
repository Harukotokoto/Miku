import { Miku } from '@/libraries/Classes/Miku';
import { IntentsBitField } from 'discord.js';

export const client = new Miku({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  allowedMentions: {
    repliedUser: false,
  },
  debugMode: true,
  admins: ['1004365048887660655'],
  prefix: 'm.',
});

process.on('unhandledRejection', (err) => {});
process.on('uncaughtException', (err) => {});

client.run();
