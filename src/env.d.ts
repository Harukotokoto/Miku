declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_TOKEN: string;
            DB_DRIVER: string;
            DB_HOST: string;
            DB_TABLE: string;
            DB_USER: string;
            DB_PASSWORD: string;
            VOICEVOX_API: string;
            VOIDS_API: string;
            ERROR_WH: string;
            SYSTEM_WH: string;
            ADDITIONAL_WH: string;
            ENCRYPTION_KEY: string;
            APP_URL: string;
        }
    }
}

export {};
