type LogType = 'info' | 'warn' | 'error' | 'debug';

import { BackgroundColor, LogColor } from '@/libraries/Enums/LogColor';

export class Logger {
    /**
     * コンストラクタは、指定された時間フォーマットを設定します。
     *
     * @param timeFormat 時間フォーマットを指定するオプションの文字列。デフォルト値は 'YYYY/MM/DD HH:mm:ss' です。
     * @return 時刻フォーマットを設定したクラスの新しいインスタンスを返します。
     */
    public constructor(private readonly timeFormat = 'YYYY/MM/DD HH:mm:ss') {}

    /**
     * 指定されたメッセージを情報ログとしてコンソールに出力します。
     *
     * @param {string} message ログに出力するメッセージ
     * @return {void} 返り値はありません
     */
    public info(message: string): void {
        console.log(
            `${LogColor.Green}[ ${LogColor.Blue}INFO ${LogColor.Green}]  ${LogColor.Magenta}${this.getTimestamp()} ${LogColor.Yellow}| ${LogColor.Reset}${message}`,
        );
    }

    /**
     * エラーメッセージをログとして出力します。
     *
     * @param {string} message ログに記録するエラーメッセージ
     * @return {void} 戻り値はありません
     */
    public error(message: string): void {
        console.log(
            `${LogColor.Green}[ ${LogColor.Red}ERROR ${LogColor.Green}] ${LogColor.Magenta}${this.getTimestamp()} ${LogColor.Yellow}| ${LogColor.Red}${message}${LogColor.Reset}`,
        );
    }

    /**
     * デバッグメッセージをコンソールに出力します。
     *
     * @param {string} message 出力するデバッグメッセージ
     * @return {void} 返り値はありません
     */
    public debug(message: string): void {
        console.log(
            `${BackgroundColor.Magenta}${LogColor.Green}[ ${LogColor.Red}DEBUG ${LogColor.Green}] ${LogColor.Red}${this.getTimestamp()} ${LogColor.Yellow}| ${LogColor.Red}${message}${LogColor.Reset}${BackgroundColor.Default}`,
        );
    }

    /**
     * 現在のタイムスタンプを指定されたフォーマットで返します。
     *
     * @param {string} format タイムスタンプのフォーマット。デフォルトは `this.timeFormat` を使用します。
     *                        使用可能なトークン: YYYY, MM, DD, HH, mm, ss
     * @return {string} 指定されたフォーマットで整形された現在のタイムスタンプ。
     */
    private getTimestamp(format = this.timeFormat) {
        const time = new Date();

        const replaceTokens: {
            [key: string]: string;
        } = {
            YYYY: time.getFullYear().toString(),
            MM: (time.getMonth() + 1).toString().padStart(2, '0'),
            DD: time.getDate().toString().padStart(2, '0'),
            HH: time.getHours().toString().padStart(2, '0'),
            mm: time.getMinutes().toString().padStart(2, '0'),
            ss: time.getSeconds().toString().padStart(2, '0'),
        };

        return format.replace(
            /YYYY|MM|DD|HH|mm|ss/g,
            (match) => replaceTokens[match] || match,
        );
    }
}
