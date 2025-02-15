import crypto from 'crypto';

const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

export function encryptUUID(uuid: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
    let encrypted = cipher.update(uuid, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}

export function decryptUUID(encryptedUUID: string): string {
    const iv = Buffer.from(encryptedUUID.slice(0, IV_LENGTH * 2), 'hex');
    const encryptedText = encryptedUUID.slice(IV_LENGTH * 2);
    const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
