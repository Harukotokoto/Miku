"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundColor = exports.LogColor = void 0;
var LogColor;
(function (LogColor) {
    LogColor["Black"] = "\u001B[30m";
    LogColor["Red"] = "\u001B[31m";
    LogColor["Green"] = "\u001B[32m";
    LogColor["Yellow"] = "\u001B[33m";
    LogColor["Blue"] = "\u001B[34m";
    LogColor["Magenta"] = "\u001B[35m";
    LogColor["Cyan"] = "\u001B[36m";
    LogColor["White"] = "\u001B[37m";
    LogColor["Reset"] = "\u001B[0m";
})(LogColor || (exports.LogColor = LogColor = {}));
var BackgroundColor;
(function (BackgroundColor) {
    BackgroundColor["Black"] = "\u001B[40m";
    BackgroundColor["Red"] = "\u001B[41m";
    BackgroundColor["Green"] = "\u001B[42m";
    BackgroundColor["Yellow"] = "\u001B[43m";
    BackgroundColor["Blue"] = "\u001B[44m";
    BackgroundColor["Magenta"] = "\u001B[45m";
    BackgroundColor["Cyan"] = "\u001B[46m";
    BackgroundColor["White"] = "\u001B[47m";
    BackgroundColor["Default"] = "\u001B[49m";
    BackgroundColor["Reset"] = "\u001B[0m";
})(BackgroundColor || (exports.BackgroundColor = BackgroundColor = {}));
