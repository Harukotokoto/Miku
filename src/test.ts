import { Voicevox } from '@/modules/Voicevox';

require('dotenv').config();

const voicevox = new Voicevox({
    defaultSpeaker: 6,
});

voicevox.generateAudio({
    text: 'こんにちは',
    path: 'output.wav',
});
