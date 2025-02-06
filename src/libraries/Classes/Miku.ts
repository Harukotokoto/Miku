import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    Client,
    ClientEvents,
    ClientOptions,
    Collection,
    EmbedFooterData,
    InteractionContextType,
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
import { GuildAudioQueue } from '@/interfaces/Voicevox';

require('dotenv').config();

/**
 * Mikuクラスは、Discord Botのクライアントを拡張して、カスタム機能や設定を提供します。
 * 主に、コマンドの登録、イベントの登録、ログ管理、固定メッセージの管理、MongoDB接続などを行います。
 */
export class Miku extends Client {
    public prefix;
    public debugMode;
    public admins;
    public onReady: () => Promise<void>;

    /**
     * クラスのコンストラクタ。
     *
     * @param {ClientOptions & MikuOptions} options クライアントおよびMikuのオプションを含むオブジェクト。
     */
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
    public systemLog = new ChannelLog(process.env.SYSTEM_WH);
    public errorLog = new ChannelLog(process.env.ERROR_WH);
    public additionalLog = new ChannelLog(process.env.ADDITIONAL_WH);

    /* 必要なモジュールを登録 */
    public globPromise = promisify(glob);

    public logger = new Logger();

    /**
     * フッターのテキストとアイコンURLを生成します。
     * @return EmbedFooterData オブジェクトでフッターのテキストとアイコンURLを返します。
     */
    public footer(): EmbedFooterData {
        const user = client.users.cache.get('1004365048887660655');
        return {
            text: 'Produced by Harukoto',
            iconURL: user?.displayAvatarURL(),
        };
    }

    /* メッセージのピンのキャッシュ */
    public pinned_channels: string[] = [];

    /**
     * データベースからピン留めされたチャンネル情報をロードし、`pinned_channels`プロパティに設定します。
     *
     * @return {Promise<void>} ピン留めされたチャンネルのロード*/
    private async loadPinnedChannels(): Promise<void> {
        const datas = await PinnedMessage.find();
        this.pinned_channels = datas.map((data) => data.channelId);
    }

    /**
     * 指定されたIDのチャンネルを固定されたチャンネルリストに追加します。
     * IDが既にリスト内に存在する場合は何も処理しません。
     *
     * @param {string} id 追加するチャンネルのID
     * @return {void} 返り値はありません
     */
    public addPinnedChannels(id: string): void {
        if (!this.pinned_channels.includes(id)) {
            this.pinned_channels.push(id);
        }
    }

    /**
     * 指定されたIDを持つ固定されたチャンネルをリストから削除します。
     *
     * @param {string} id 削除するチャンネルのID
     * @return {void} 戻り値はありません
     */
    public removePinnedChannels(id: string): void {
        this.pinned_channels = this.pinned_channels.filter(
            (channelId) => channelId !== id,
        );
    }

    /**
     * アプリケーションを実行するメソッド。ログイン、コマンド登録、イベント登録、
     * 固定メッセージの読み込み、MongoDB接続、及び初期準備を行う。
     *
     * @return {void} このメソッドは値を返しません。
     */
    public run(): void {
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

    /**
     * MongoDBに接続を試みる非同期処理を実行します。
     *
     * @return {Promise} MongoDBへの接続を管理するPromiseオブジェクトを返します。
     */
    private connect(): Promise<any> {
        return mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_TABLE}`,
        );
    }

    public commands: Collection<string, CommandType> = new Collection();

    /**
     * 指定されたファイルパスからモジュールをインポートし、そのデフォルトエクスポートを返します。
     *
     * @param filePath インポートするファイルのパス。文字列で指定します。
     * @return インポートしたモジュールのデフォルトエクスポートを返します。プロミスでラップされています。
     */
    public async importFile<T>(filePath: string): Promise<T> {
        const file = await import(filePath);
        if (!file) {
            this.logger.error(`File ${filePath} not found`);
        }

        return file.default;
    }

    /**
     * コマンドを登録する非同期メソッド。
     * 指定ディレクトリからコマンドファイルを取得し、それらをアプリケーションに登録します。
     *
     * @return {Promise<void>} この処理が完了すると、Promiseが解決されます。
     */
    private async registerCommands(): Promise<void> {
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

            if (command.userInstall) {
                command.contexts = [
                    InteractionContextType.BotDM,
                    InteractionContextType.Guild,
                    InteractionContextType.PrivateChannel,
                ];

                command.integrationTypes = [
                    ApplicationIntegrationType.GuildInstall,
                    ApplicationIntegrationType.UserInstall,
                ];
            } else {
                command.contexts = [InteractionContextType.Guild];

                command.integrationTypes = [
                    ApplicationIntegrationType.GuildInstall,
                ];
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

    /**
     * イベントを登録する非同期メソッド。
     * 指定されたディレクトリ内のイベントファイルを読み込み、
     * クライアントイベントにリスナーを登録します。
     *
     * @return {Promise<void>} イベント登録の完了を示すPromiseを返します。
     */
    private async registerEvents(): Promise<void> {
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
