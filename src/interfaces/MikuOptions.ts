export interface MikuOptions {
    debugMode?: boolean;
    admins?: string[];
    prefix?: string;
    onReady?: () => Promise<void>;
}
