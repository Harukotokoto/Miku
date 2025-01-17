import { AudioQueryOptions } from '@/interfaces/AudioQueryOptions';

export interface SynthesisOptions extends AudioQueryOptions {
    enableInterrogativeUpspeak?: boolean;
}
