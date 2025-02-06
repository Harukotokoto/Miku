import emojiRegex from 'emoji-regex';

export function convertCleanMessage(text: string) {
    text = text.replace(/<:[a-zA-Z0-9_]+:[0-9]+>/g, '');

    text = text.replace(emojiRegex(), '');

    text = text.replace(/(https?|ftp)(:\/\/[\w/:%#$&?()~.=+-]+)/g, '');

    text = text.replace(/\r?\n/g, '、');

    if (text.length > 40) {
        return text.slice(0, 40) + '以下省略';
    }

    return text;
}
