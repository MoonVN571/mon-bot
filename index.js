const { Client, Collection, Intents, WebhookClient } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_WEBHOOKS
    ],
    allowedMentions: { parse: ['users'] }
});

module.exports = client;

require('dotenv').config();
const { sleep }  =require('./utils/utils');
const configs = require('./config.json');
const config = {
    TOKEN: process.env.TOKEN,
    PREFIX: "s",
    ERR_COLOR: configs.color.error,
    DEF_COLOR: configs.color.default,
    DEV: configs.dev,
    ADMINS: configs.Admin
}

const emoji = {
    failed: "<:1024_TickNo_Night:883667478813736960> | ",
    success: "<:1300_TickYes_Night:883667478830518312> | ",
    dongxu: "<:1824_coin:883648611592855553>",
    hopqua: "<:giveaway:888776734625894452>",
    gaLinkFooter: "https://cdn.discordapp.com/emojis/888798422084223036.gif?v=1"
}

client.emoji = emoji;

client.config = config;

client.slashCommands = new Collection();
client.commands = new Collection();
client.tts = new Collection();

// ghost ping system
client.Pings = new Collection();

// Check for next Mention with cache data
client.mentions = new Set();

// Giveaway module
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './data/giveaway/giveaways.json',
    forceUpdateEvery: 10000,
    default: {
        botsCanWin: false,
        embedColor: 'BLUE',
        embedColorEnd: 'AQUA',
        reaction: '<:giveaway:888776734625894452>'
    }
});

client.giveawaysManager = manager;


function hook(type, url, content) {
    new WebhookClient({
        url: url
    },{
        shards: 0,
    }).send(content).catch(err => console.log(type + " " + err));
}

// send logs
async function sendError(type, error) {
    // await client.channels.cache.get("881016544396709898").send(error).catch(console.error);
    console.log(error);
    if(error && error.message && type) return hook("Error Logs", process.env.WEBHOOK_ERROR, type + " " + error.message);
    if(!error) return  console.log(error);
    hook("Error Logs", process.env.WEBHOOK_ERROR, type + " " + error.message);
}

async function sendWarn(error) {
    await client.user.fetch(config.ADMINS).then(user => user.send(error)).catch(console.error);
}

async function sendLog(content) {
    // console.log(content);
    if(!content) return;
    hook("Send Logs", process.env.WEBHOOK_LOGS, `\`\`\`${content}\`\`\``);
}

function msgDelete(msg,timeout) {
    if(!msg) return;
    if(!timeout) timeout = 5000;
    if(msg.deletable) setTimeout(() => msg.delete(), timeout);
}

client.msgDelete = msgDelete;

client.sendError = sendError;
client.sendWarn = sendWarn;
client.sendLog = sendLog;

require("./handlers/baseHandler")(client);

/*
client.once('shardReady', async shard => {
    console.log("Shard ID " + shard + " is ready!");

    ready();
}); */
async function ready() {
    await sleep(30000);

    /*
    // Giveaway module
    const { GiveawaysManager } = require('discord-giveaways');
    const GiveawayManagerWithShardSupport = class extends GiveawaysManager {
        // Refresh storage method is called when the database is updated on one of the shards
        async refreshStorage() {
            // This should make all shard refreshing their cache with the updated database
            return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
        }
    };

    // Create a new instance of your new class
    const manager = new GiveawayManagerWithShardSupport(client, {
        storage: './data/giveaway/giveaway.json',
        updateCountdownEvery: 10000,
        default: {
            botsCanWin: false,
            embedColor: '#FF0000',
            embedColorEnd: 'BLUE',
            reaction: '🎉'
        },
    });

    client.giveawaysManager = manager; 

    setInterval(async () => {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];
        
        try {
            const results = await Promise.all(promises);
            const totalGuilds = results[0].reduce((acc_1, guildCount) => acc_1 + guildCount, 0);
            const totalMembers = results[1].reduce((acc_2, memberCount) => acc_2 + memberCount, 0);

            client.user.setPresence({
                activities: [
                    {
                        name: Intl.NumberFormat().format(totalGuilds) + " servers and " + Intl.NumberFormat().format(totalMembers) + " users | @Mon Bot | s help",
                        type: "WATCHING"
                    }
                ], status: "idle"
            });
        } catch (message) {
            return console.error(message);
        }
    }, 60 * 1000);
    // }); */
}
client.login(process.env.TOKEN, (err) => console.log(err));
