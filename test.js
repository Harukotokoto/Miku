const { SnowflakeUtil } = require('discord.js');

const sf = '1319987762224693269';

console.log(SnowflakeUtil.timestampFrom(sf));
console.log(SnowflakeUtil.deconstruct(sf));
console.log(SnowflakeUtil.workerId);
console.log(SnowflakeUtil.epoch);
console.log(SnowflakeUtil.processId);
