import { CommandType } from '@/interfaces/Command';

export class Command {
    /**
     * CommandTypeオブジェクトを元にコンストラクタを初期化します。
     *
     * @param {CommandType} commandOptions CommandType型のオブジェクトを指定します。このオブジェクトのプロパティはクラスのメンバに割り当てられます。
     */
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions);
    }
}
