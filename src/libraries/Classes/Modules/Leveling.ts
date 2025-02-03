import { Guild, User } from 'discord.js';
import leveling from '@/models/Leveling';
import {
    BuiltInGraphemeProvider,
    Font,
    LeaderboardBuilder,
    RankCardBuilder,
} from 'canvacord';
import { client } from '@/index';
import { writeFileSync } from 'fs';
import sharp from 'sharp';

export class Leveling {
    private user: User;
    private guild: Guild;

    constructor(user: User, guild: Guild) {
        this.user = user;
        this.guild = guild;
    }

    private calculateNeedXp(level: number) {
        return (
            150 * level +
            Math.pow(level, 2) * 0.5 +
            (123 * level + Math.pow(level, 2) * 0.5)
        );
    }

    private calculateLevel(cumulativeXp: number): number {
        let level = 0;

        while (cumulativeXp >= this.calculateNeedXp(level)) {
            cumulativeXp -= this.calculateNeedXp(level);
            level++;
        }

        return level;
    }

    private async getXp() {
        const level = await leveling.findOne({
            userId: this.user.id,
            guildId: this.guild.id,
        });

        if (!level) return 0;

        return level.xp;
    }

    public async isCoolTime() {
        const level = await leveling.findOne({
            userId: this.user.id,
            guildId: this.guild.id,
        });

        if (!level) return false;

        if (level) {
            return level.lastGiven.getTime() + 15 * 1000 > new Date().getTime();
        }
    }

    public async giveXp(xp?: number) {
        const level = await leveling.findOne({
            userId: this.user.id,
            guildId: this.guild.id,
        });

        const randomXp = xp || Math.floor(Math.random() * (15 - 5 + 1)) + 5;

        if (level) {
            level.xp += randomXp;
            level.lastGiven = new Date();

            await level.save();
        } else {
            const newLevel = new leveling({
                userId: this.user.id,
                guildId: this.guild.id,
                xp: randomXp,
                lastGiven: new Date(),
            });

            await newLevel.save();
        }

        return randomXp;
    }

    public async getInfo() {
        const xp = await this.getXp();
        const level = this.calculateLevel(xp);

        return {
            xp,
            level,
        };
    }

    public async getRank() {
        const allLevels = (
            await leveling
                .find({
                    guildId: this.guild.id,
                })
                .select('-_id userId xp')
        ).sort((a, b) => b.xp - a.xp);

        return allLevels.findIndex((lvl) => lvl.userId === this.user.id) + 1;
    }

    public async createRankCard() {
        const info = await this.getInfo();

        const requiredXp = this.calculateNeedXp(info.level ?? 0);

        Font.loadDefault();
        Font.fromFileSync(
            `${__dirname}/../../../../assets/NotoSansJP-Regular.ttf`,
        );

        const rank = new RankCardBuilder()
            .setAvatar(this.user.displayAvatarURL())
            .setRank((await this.getRank()) ?? 0)
            .setLevel(info.level ?? 0)
            .setCurrentXP(info.xp ?? 0)
            .setRequiredXP(requiredXp)
            .setUsername(`${this.user.displayName}(${this.user.tag})`)
            .setGraphemeProvider(BuiltInGraphemeProvider.Noto);

        return rank.build({
            format: 'png',
        });
    }

    public static async resetGuild(guild: Guild) {
        await leveling.deleteMany({ guildId: guild.id });
    }

    public async resetUser() {
        await leveling.deleteMany({ userId: this.user.id });
    }

    public static async createLeaderboard(guild: Guild) {
        Font.loadDefault();
        Font.fromFileSync(
            `${__dirname}/../../../../assets/NotoSansJP-Regular.ttf`,
        );

        const allLevels = (
            await leveling.find({ guildId: guild.id }).select('-_id userId xp')
        )
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 8);

        const lb = new LeaderboardBuilder()
            .setHeader({
                title: guild.name,
                image:
                    guild.iconURL({ size: 256, extension: 'png' }) ||
                    client.user!.displayAvatarURL(),
                subtitle: `${guild.memberCount} members`,
            })
            .setPlayers(
                await Promise.all(
                    allLevels
                        .map(async (lvl) => {
                            const userId = lvl.userId;
                            const user = await client.users.fetch(userId);

                            const leveling = new Leveling(user, guild);

                            const level = await leveling.getInfo();

                            return {
                                username: user.tag,
                                displayName: user.displayName,
                                level: level.level,
                                xp: level.xp,
                                rank: (await leveling.getRank()) ?? 0,
                                avatar:
                                    user.displayAvatarURL({
                                        size: 256,
                                        extension: 'png',
                                    }) || user.defaultAvatarURL, // アバター URL の安全なチェック
                            };
                        })
                        .filter((player) => player !== null), // null 対応
                ),
            )
            .setBackground(
                'https://unblast.com/wp-content/uploads/2021/01/Space-Background-Image-2.jpg',
            )
            .setVariant('default')
            .adjustCanvas();

        const image = await lb.build({ format: 'svg' });

        return await sharp(Buffer.from(image))
            .resize({ width: 1024 })
            .png()
            .toBuffer();
    }
}
