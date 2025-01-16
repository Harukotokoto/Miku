import * as os from 'node:os';

export function getOsName(): string {
    return `${os.type()} ${os.release()}`;
}
