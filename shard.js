const { ShardingManager } = require('discord.js');
require('dotenv').config();
const manager = new ShardingManager('./index.js', {
    token: process.env.TOKEN,
    totalShards: 'auto',
    shardDelay: 10000,
    mode: 'process'
});

manager.spawn({
    amount: 'auto',
    delay: 500,
    timeout: 100000
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

// manager.respawn({ delay: 10000, timeout: 30000});