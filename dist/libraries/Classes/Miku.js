"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miku = void 0;
const discord_js_1 = require("discord.js");
const Logger_1 = require("../Classes/Utils/Logger");
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
const index_1 = require("../../index");
require('dotenv').config();
const globPromise = (0, util_1.promisify)(glob_1.default);
class Miku extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.logger = new Logger_1.Logger();
        this.commands = new discord_js_1.Collection();
        this.debugMode = options.debugMode || false;
        this.admins = options.admins || [];
        this.prefix = options.prefix || '!';
    }
    footer() {
        const user = index_1.client.users.cache.get('1004365048887660655');
        return {
            text: 'Produced by ' + (user ? user.displayName : 'Harukoto'),
        };
    }
    run() {
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
    }
    importFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            if (!file) {
                this.logger.error(`File ${filePath} not found`);
            }
            return file.default;
        });
    }
    registerCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            const commands = [];
            const commandFiles = yield globPromise(__dirname + '/../../handlers/commands/**/*{.ts,.js}');
            for (const file of commandFiles) {
                const command = yield this.importFile(file);
                this.logger.info(`/${command.name}を読み込みました`);
                commands.push(command);
                this.commands.set(command.name, command);
            }
            this.once('ready', () => {
                var _a;
                (_a = this.application) === null || _a === void 0 ? void 0 : _a.commands.set(commands).then(() => this.logger.info(`${commands.length}個のスラッシュコマンドを${this.guilds.cache.size}個のサーバーで登録しました`)).catch((e) => {
                    this.logger.error(`Failed to register slash commands`);
                    this.logger.error(e);
                });
            });
        });
    }
    registerEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const eventFiles = yield globPromise(`${__dirname}/../../handlers/events/**/*{.ts,.js}`);
            for (const filePath of eventFiles) {
                const event = yield this.importFile(filePath);
                if (event && 'event' in event) {
                    this.on(event.event, event.run);
                }
            }
        });
    }
}
exports.Miku = Miku;
