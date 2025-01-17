import {
    ApplicationCommandType,
    Client,
    ClientEvents,
    ClientOptions,
    Collection,
    EmbedFooterData,
} from 'discord.js';
import { Logger } from '@/libraries/Classes/Utils/Logger';
import { promisify } from 'util';
import glob from 'glob';
import { CommandType } from '@/interfaces/Command';
import { Event } from '@/libraries/Classes/Handlers/Event';
import { client } from '@/index';
import { MikuOptions } from '@/interfaces/MikuOptions';
import PinnedMessage from '@/libraries/Models/PinnedMessage';
import * as mongoose from 'mongoose';
import { ChannelLog } from '@/libraries/Classes/Utils/ChannelLog';
import { GuildAudioQueue } from '@/interfaces/GuildAudioQueue';

require('dotenv').config();

export class Miku extends Client {
    /* Clientの設定 */
    public prefix;
    public debugMode;
    public admins;
    public onReady: () => Promise<void>;

    public constructor(options: ClientOptions & MikuOptions) {
        super(options);

        this.debugMode = options.debugMode || false;
        this.admins = options.admins || [];
        this.prefix = options.prefix || '!';
        this.onReady = options.onReady || (async () => {});
    }

    /* 読み上げ機能のキャッシュ */
    public readerChannels = new Collection<string, string>();
    public guildAudioQueues = new Collection<string, GuildAudioQueue>();

    /* ログのWebhookの設定 */
    public systemLog = new ChannelLog(
        'https://discord.com/api/webhooks/1329433379996958730/o7U0FyCpbEFfbQ5Wv9zt85pIMUky3YI1atmdAyat-6e26XrKna1USMeTSSQmFAnZFIza',
    );
    public errorLog = new ChannelLog(
        'https://discord.com/api/webhooks/1329433613191741491/wp66FtEnU4U-d_8tr1LJLie9aqB0MWo3VJm3xLNNY3RlXawsG7l2pXPi6EloCbMRVlUV',
    );
    public additionalLog = new ChannelLog(
        'https://discord.com/api/webhooks/1329433694733336637/AX7lknq4opQK941pqA69cnvNqlxHdzHQuwTZ170Xq5qasFE0bIwg43c_yb-Y8c49V08x',
    );

    /* 必要なモジュールを登録 */
    public globPromise = promisify(glob);

    public logger = new Logger();

    public footer(): EmbedFooterData {
        const user = client.users.cache.get('1004365048887660655');
        return {
            text: 'Produced by Harukoto',
            iconURL: user?.displayAvatarURL(),
        };
    }

    /* メッセージのピンのキャッシュ */
    public pinned_channels: string[] = [];

    private async loadPinnedChannels() {
        const datas = await PinnedMessage.find();
        this.pinned_channels = datas.map((data) => data.channelId);
    }

    public addPinnedChannels(id: string) {
        if (!this.pinned_channels.includes(id)) {
            this.pinned_channels.push(id);
        }
    }

    public removePinnedChannels(id: string) {
        this.pinned_channels = this.pinned_channels.filter(
            (channelId) => channelId !== id,
        );
    }

    public run() {
        this.login(process.env.CLIENT_TOKEN)
            .then(() => {
                this.logger.info('ログインしました');
            })
            .catch((e) => {
                this.logger.error(e);
            });

        this.registerCommands().then(() => {
            this.logger.info('全てのコマンドが正常に登録されました');
        });

        this.registerEvents().then(() => {
            this.logger.info('全てのイベントが正常に登録されました');
        });

        this.loadPinnedChannels().then(() => {
            this.logger.info(
                'メッセージが固定されているチャンネルをキャッシュしました',
            );
        });

        this.connect().then(() => {
            this.logger.info(`MongoDBに接続しました`);
        });

        this.once('ready', async () => await this.onReady());
    }

    private connect() {
        return mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_TABLE}`,
        );
    }

    public commands: Collection<string, CommandType> = new Collection();

    public async importFile<T>(filePath: string): Promise<T> {
        const file = await import(filePath);
        if (!file) {
            this.logger.error(`File ${filePath} not found`);
        }

        return file.default;
    }

    private async registerCommands() {
        const commands: CommandType[] = [];
        const commandFiles = await this.globPromise(
            __dirname + '/../../handlers/commands/**/*{.ts,.js}',
        );

        for (const file of commandFiles) {
            const command: CommandType = await this.importFile(file);

            if (
                !command.type ||
                command.type === ApplicationCommandType.ChatInput
            ) {
                this.logger.info(`"/${command.name}"を読み込みました`);
            } else {
                this.logger.info(`"${command.name}"を読み込みました`);
            }

            commands.push(command);
            this.commands.set(command.name, command);
        }

        this.once('ready', () => {
            this.application?.commands
                .set(commands)
                .then(() =>
                    this.logger.info(
                        `${commands.length}個のスラッシュコマンドを${this.guilds.cache.size}個のサーバーで登録しました`,
                    ),
                )
                .catch((e) => {
                    this.logger.error(`Failed to register slash commands`);
                    this.logger.error(e);
                });
        });
    }

    private async registerEvents() {
        const eventFiles = await this.globPromise(
            `${__dirname}/../../handlers/events/**/*{.ts,.js}`,
        );

        for (const filePath of eventFiles) {
            const event =
                await this.importFile<Event<keyof ClientEvents>>(filePath);
            if (event && 'event' in event) {
                this.on(event.event, event.run);
            }
        }
    }
}
