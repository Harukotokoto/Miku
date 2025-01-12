import { LibraryType } from '@/libraries/Enums/LibraryType';

export interface Library {
    type: LibraryType;
    libraries: {
        name: string;
        version: string;
    }[];
}
