import { Colors, CommandInteraction, Message } from 'discord.js';
import { client } from '@/index';

export enum ErrorTypes {
    Warn = Colors.Yellow,
    Error = Colors.Red,
}

export class CommandError {
    private readonly parent: CommandInteraction | Message;

    public constructor(parent: CommandInteraction | Message) {
        this.parent = parent;
    }

    /**
     * 指定されたメッセージおよびエラータイプに基づいて応答メッセージを作成します。
     *
     * @param {string} [message] 応答メッセージに含めるオプションのメッセージ文字列。
     * @param {ErrorTypes} [ErrorType] 発生したエラーの種類を指定するオプションのエラータイプ。
     * @return {Promise<void>} メソッド完了後のPromiseオブジェクトを返します。
     */
    public async create(
        message?: string,
        ErrorType?: ErrorTypes,
    ): Promise<void> {
        if (this.parent instanceof CommandInteraction) {
            await this.parent.followUp({
                embeds: [
                    {
                        title:
                            ErrorType === ErrorTypes.Error
                                ? 'エラーが発生しました'
                                : undefined,
                        description: message || undefined,
                        color: ErrorType || Colors.Red,
                        footer: client.footer(),
                    },
                ],
            });
        } else {
            await this.parent.reply({
                embeds: [
                    {
                        title:
                            ErrorType === ErrorTypes.Error
                                ? 'エラーが発生しました'
                                : undefined,
                        description: message || undefined,
                        color: ErrorType || Colors.Red,
                        footer: client.footer(),
                    },
                ],
                allowedMentions: {
                    parse: [],
                },
            });
        }
    }

    /**
     * 指定されたメッセージを編集します。
     *
     * @param {string} message 編集するメッセージ内容
     * @param {ErrorTypes} [ErrorType] エラーの種類を指定（省略可）。エラーに基づいてメッセージの見た目や内容が変更される場合があります。
     * @return {Promise<void>} メッセージ編集が完了した場合に解決されるPromise
     * @throws {Error} コマンドインタラクション以外でこのメソッドが呼び出された場合に例外をスローします。
     */
    public async edit(message: string, ErrorType?: ErrorTypes) {
        if (this.parent instanceof CommandInteraction) {
            await this.parent.editReply({
                embeds: [
                    {
                        title:
                            ErrorType === ErrorTypes.Error
                                ? 'エラーが発生しました'
                                : undefined,
                        description: message,
                        color: ErrorType || Colors.Red,
                        footer: client.footer(),
                    },
                ],
            });
        } else {
            new Error('Editエラーはコマンドでのみ使用できます');
        }
    }
}
