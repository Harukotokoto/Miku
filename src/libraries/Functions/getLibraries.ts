import fs from 'fs';
import path from 'path';
import { Library } from '@/interfaces/Library';
import { LibraryType } from '@/libraries/Enums/LibraryType';

export const getLibraries = (): Library[] => {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const dependencies = packageJson.dependencies
        ? Object.entries<string>(packageJson.dependencies).map(
              ([name, version]) => ({
                  name,
                  version,
              }),
          )
        : [];

    const devDependencies = packageJson.devDependencies
        ? Object.entries<string>(packageJson.devDependencies).map(
              ([name, version]) => ({
                  name,
                  version,
              }),
          )
        : [];

    return [
        {
            type: LibraryType.dependencies,
            libraries: dependencies,
        },
        {
            type: LibraryType.devDependencies,
            libraries: devDependencies,
        },
    ];
};
