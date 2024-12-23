import { Command } from '@/handlers/Command';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
  name: 'gpt',
  description: 'Chat-GPT 4と会話します',
  options: [
    {
      name: 'content',
      description: '',
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: {},
});
