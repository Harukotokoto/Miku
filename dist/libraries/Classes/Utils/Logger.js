"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const LogColor_1 = require("../../Enums/LogColor");
class Logger {
    constructor(timeFormat = 'YYYY/MM/DD HH:mm:ss') {
        this.timeFormat = timeFormat;
    }
    info(message) {
        console.log(`${LogColor_1.LogColor.Green}[ ${LogColor_1.LogColor.Blue}INFO ${LogColor_1.LogColor.Green}]  ${LogColor_1.LogColor.Magenta}${this.getTimestamp()} ${LogColor_1.LogColor.Yellow}| ${LogColor_1.LogColor.Reset}${message}`);
    }
    error(message) {
        console.log(`${LogColor_1.LogColor.Green}[ ${LogColor_1.LogColor.Red}ERROR ${LogColor_1.LogColor.Green}] ${LogColor_1.LogColor.Magenta}${this.getTimestamp()} ${LogColor_1.LogColor.Yellow}| ${LogColor_1.LogColor.Red}${message}${LogColor_1.LogColor.Reset}`);
    }
    debug(message) {
        console.log(`${LogColor_1.BackgroundColor.Magenta}${LogColor_1.LogColor.Green}[ ${LogColor_1.LogColor.Red}DEBUG ${LogColor_1.LogColor.Green}] ${LogColor_1.LogColor.Red}${this.getTimestamp()} ${LogColor_1.LogColor.Yellow}| ${LogColor_1.LogColor.Red}${message}${LogColor_1.LogColor.Reset}${LogColor_1.BackgroundColor.Default}`);
    }
    getTimestamp(format = this.timeFormat) {
        const time = new Date();
        const replaceTokens = {
            YYYY: time.getFullYear().toString(),
            MM: (time.getMonth() + 1).toString().padStart(2, '0'),
            DD: time.getDate().toString().padStart(2, '0'),
            HH: time.getHours().toString().padStart(2, '0'),
            mm: time.getMinutes().toString().padStart(2, '0'),
            ss: time.getSeconds().toString().padStart(2, '0'),
        };
        return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => replaceTokens[match] || match);
    }
}
exports.Logger = Logger;
