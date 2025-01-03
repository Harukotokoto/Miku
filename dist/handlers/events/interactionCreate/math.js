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
const Event_1 = require("../../../libraries/Classes/Handlers/Event");
const discord_js_1 = require("discord.js");
const index_1 = require("../../../index");
const generateRandamEquation_1 = require("../../../libraries/Functions/Util/generateRandamEquation");
exports.default = new Event_1.Event('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    if (!interaction.isButton())
        return;
    if (interaction.customId.startsWith('math-')) {
        const roleId = interaction.customId.split('-')[1];
        const role = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.roles.fetch(roleId));
        if (!role) {
            return yield interaction.followUp({
                embeds: [
                    {
                        title: 'エラーが発生しました',
                        description: '設定されたロールが存在しません',
                        color: discord_js_1.Colors.Red,
                        footer: {
                            text: 'サーバー管理者に報告してください',
                        },
                    },
                ],
            });
        }
        const member = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(interaction.user.id);
        if (!member)
            return;
        if (member.roles.cache.has(role.id)) {
            return yield interaction.reply({
                embeds: [
                    {
                        title: 'エラーが発生しました',
                        description: '既に認証されています',
                        color: discord_js_1.Colors.Red,
                        footer: index_1.client.footer(),
                    },
                ],
                ephemeral: true,
            });
        }
        const me = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.cache.get((_d = index_1.client.user) === null || _d === void 0 ? void 0 : _d.id);
        if (!me)
            return;
        if (me.roles.highest.position < role.position ||
            !me.permissions.has(discord_js_1.PermissionFlagsBits.ManageRoles)) {
            return yield interaction.reply({
                embeds: [
                    {
                        title: 'エラーが発生しました',
                        description: '権限が足りず、Botがロールを付与することができません',
                        color: discord_js_1.Colors.Red,
                        footer: index_1.client.footer(),
                    },
                ],
                ephemeral: true,
            });
        }
        const equation = (0, generateRandamEquation_1.generateRandomEquation)();
        yield interaction.showModal({
            title: '認証します',
            customId: 'equation_modal',
            components: [
                {
                    type: discord_js_1.ComponentType.ActionRow,
                    components: [
                        {
                            type: discord_js_1.ComponentType.TextInput,
                            label: `方程式を解いてください: ${equation.question}`,
                            customId: 'equation_input',
                            style: discord_js_1.TextInputStyle.Short,
                        },
                    ],
                },
            ],
        });
        const submitted = yield interaction
            .awaitModalSubmit({
            time: 60000,
            filter: (i) => i.user.id === interaction.user.id,
        })
            .catch((error) => {
            console.error(error);
            return null;
        });
        if (submitted) {
            if (submitted.customId !== 'equation_modal')
                return;
            const answer = submitted.fields.getTextInputValue('equation_input');
            if (answer !== ((_e = equation.answer) === null || _e === void 0 ? void 0 : _e.toString())) {
                return yield submitted.reply({
                    embeds: [
                        {
                            title: 'エラーが発生しました',
                            description: '回答が違います',
                            color: discord_js_1.Colors.Red,
                            footer: index_1.client.footer(),
                        },
                    ],
                    ephemeral: true,
                });
            }
            yield member.roles.add(role);
            yield submitted.reply({
                embeds: [
                    {
                        title: '認証しました',
                        description: `${role}が付与されました`,
                        color: discord_js_1.Colors.Green,
                        footer: index_1.client.footer(),
                    },
                ],
                ephemeral: true,
            });
        }
    }
}));
