const { Client, Collection, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

module.exports = client;

require('dotenv').config();

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
    dongxu: "<:1824_coin:883648611592855553>"
}

client.emoji = emoji;

client.config = config;

client.slashCommands = new Collection();
client.commands = new Collection();

// ghost ping system
client.Pings = new Collection();

// Check for next Mention with cache data
client.mentions = new Set();

// Giveaway module
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './data/giveaway/giveaway.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        embedColorEnd: 'AQUA',
        reaction: '🎉'
    },
});

client.giveawaysManager = manager;

// send logs
function sendError(error) {
    if(!error) return;
    if(!error.message) return;
    client.channels.cache.get("881016544396709898").send(err.message);
}

function sendWarn(error) {
    if(!error) return;
    if(!error.message) return;
    client.users.cache.get(config.ADMINS).send(err.message);
}

function sendLog(content) {
    console.log(content);
    if(!content) return;
    client.channels.cache.get("885542310165753986").send(content);
}

client.sendError = sendError;
client.sendWarn = sendWarn;
client.sendWarn = sendLog;

require("./handlers/baseHandler")(client);

client.login(process.env.TOKEN, (err) => console.log(err));
