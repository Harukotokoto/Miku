import { SynthesisOptions } from '@/interfaces/SynthesisOptions';

export interface GenerateAudioOptions extends SynthesisOptions {
    path: string;
}
