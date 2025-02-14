import { Guild } from 'discord.js';
import config from '@/models/ModuleConfig';

export class ModuleConfig {
    private guild: Guild;
    private moduleId: string;

    constructor(guild: Guild, moduleId: string) {
        this.guild = guild;
        this.moduleId = moduleId;
    }

    public async disable() {
        const cfg = await config.findOne({ guildId: this.guild.id });

        if (!cfg) {
            const newCfg = new config({
                guildId: this.guild.id,
                modules: [
                    {
                        moduleId: this.moduleId,
                        isEnabled: false,
                    },
                ],
            });

            await newCfg.save();
        } else {
            const module = cfg.modules.find(
                (m) => m.moduleId === this.moduleId,
            );
            if (!module) {
                cfg.modules.push({
                    moduleId: this.moduleId,
                    isEnabled: false,
                });
            } else {
                module.isEnabled = false;
            }

            await cfg.save();
        }
    }

    public async enable() {
        const cfg = await config.findOne({ guildId: this.guild.id });

        if (!cfg) {
            const newCfg = new config({
                guildId: this.guild.id,
                modules: [
                    {
                        moduleId: this.moduleId,
                        isEnabled: true,
                    },
                ],
            });

            await newCfg.save();
        } else {
            const module = cfg.modules.find(
                (m) => m.moduleId === this.moduleId,
            );
            if (!module) {
                cfg.modules.push({
                    moduleId: this.moduleId,
                    isEnabled: true,
                });
            } else {
                module.isEnabled = true;
            }

            await cfg.save();
        }
    }

    public async isEnabled(defaultState = true) {
        const cfg = await config.findOne({ guildId: this.guild.id });
        if (!cfg) return defaultState || true;

        const module = cfg.modules.find((m) => m.moduleId === this.moduleId);
        if (!module) return defaultState || true;

        return module.isEnabled;
    }
}
