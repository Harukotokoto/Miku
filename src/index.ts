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
  admins: ['1004365048887660655', '957885295251034112'],
  prefix: 'm.',
});

process.on('unhandledRejection', (err) => {
  client.logger.error(err as string);
});
process.on('uncaughtException', (err) => {
  client.logger.error(err.message);
});

client.run();
