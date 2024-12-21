"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../../libraries/Classes/Handlers/Command");
const createBar_1 = require("../../../libraries/Functions/Util/createBar");
const discord_js_1 = require("discord.js");
exports.default = new Command_1.Command({
    name: 'server',
    description: 'サーバーの情報を表示します',
    execute: {
        interaction: (_a) => __awaiter(void 0, [_a], void 0, function* ({ client, interaction }) {
            var _b, _c, _d;
            const guild = interaction.guild;
            if (!guild)
                return;
            const verification_levels = {
                0: '無し',
                1: '低',
                2: '中',
                3: '高',
                4: '最高',
            };
            const createBoostBar = () => {
                var _a;
                const boostCount = (_a = guild.premiumSubscriptionCount) !== null && _a !== void 0 ? _a : 0;
                const boostLevel = guild.premiumTier;
                switch (boostLevel) {
                    case 0:
                        return (`レベル無し | ${boostCount === 0 ? '未' : boostCount}ブースト\n` +
                            (0, createBar_1.createBar)(boostCount, 2) +
                            `\n次のレベルまで: ${boostCount}/2`);
                    case 1:
                        return (`レベル ${boostLevel} | ${boostCount}ブースト\n` +
                            (0, createBar_1.createBar)(boostCount, 7) +
                            `\n次のレベルまで: ${boostCount}/7`);
                    case 2:
                        return (`レベル ${boostLevel} | ${boostCount}ブースト\n` +
                            (0, createBar_1.createBar)(boostCount, 14) +
                            `\n次のレベルまで: ${boostCount}/14`);
                    case 3:
                        return (`レベル ${boostLevel} | ${boostCount}ブースト\n` +
                            (0, createBar_1.createBar)(14, 14) +
                            '\nブーストレベル最大🎉');
                }
            };
            yield interaction.followUp({
                embeds: [
                    {
                        author: {
                            name: guild.name,
                            icon_url: (_b = guild.iconURL()) === null || _b === void 0 ? void 0 : _b.toString(),
                        },
                        image: {
                            url: ((_c = guild.bannerURL()) === null || _c === void 0 ? void 0 : _c.toString()) || '',
                        },
                        fields: [
                            {
                                name: 'サーバー作成日',
                                value: '<t:' + Math.round(guild.createdAt.getTime() / 1000) + '>',
                                inline: true,
                            },
                            {
                                name: 'サーバー所有者',
                                value: '<@!' + (yield guild.fetchOwner()).id + '>',
                                inline: true,
                            },
                            {
                                name: 'メンバー数',
                                value: guild.memberCount + '人',
                                inline: true,
                            },
                            {
                                name: 'BANされたユーザー数',
                                value: (yield guild.bans.fetch()).size.toString() + 'メンバー',
                                inline: true,
                            },
                            {
                                name: '認証レベル',
                                value: verification_levels[guild.verificationLevel],
                                inline: true,
                            },
                            {
                                name: 'サーバーブースト進行度',
                                value: (_d = createBoostBar()) !== null && _d !== void 0 ? _d : '生成中にエラーが発生しました',
                            },
                        ],
                        color: discord_js_1.Colors.Gold,
                        footer: client.footer(),
                    },
                ],
            });
        }),
    },
});
