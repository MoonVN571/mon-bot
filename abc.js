const { Client, Intents, Permissions, Collection } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
const { Admin, dev } = require('./config.json');
const Database = require('simplest.db');
const { readdirSync } = require('fs');
client.on('ready', () => {
    console.log("Bot is online!");
});
client.commands = new Collection();

// Command handler
readdirSync('./commands/').forEach(dir => {
    const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

    commands.forEach((file) => {
        const pull = require(`./commands/${dir}/${file}`);

        if (pull.name) client.commands.set(pull.name, pull);
    });
});

client.on("ready", async () => {
     await client.application.commands.set([]);
});

client.on('messageCreate', message => {
    if(message.guild.members.cache.find(u => u.id == "898396676354621501")) {
        let db = new Database({path:'./data/guilds/' + message.guildId +".json"});
        db.clear();
        return message.guild.leave();
    }

    if (message.author.bot || message.author === client.user || !message.guild) return;

    // Main
    let dataPrefix = new Database({ path: "./data/guilds/" + message.guildId + ".json" });
    const prefix = dataPrefix.get("prefix") || "s";

    let regex = /[a-z]|[A-Z]/i;
    if (message.content.split(" ")[0].match(regex)) {
        if (!message.content.toLowerCase().startsWith(prefix) || !message.content.toLowerCase().startsWith(prefix)) return;
    } else {
        if (!message.content.startsWith(prefix) || !message.content.startsWith(prefix)) return;
    }


    var args = message.content.slice(prefix.length).trim().split(/ +/);
    let cmdName = args.shift().toLowerCase();

    let cmd = client.commands.get(cmdName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if (!cmd) return;
    if (cmd.disabled) return;
    if (cmd.dev && Admin !== message.author.id) return;
    if(dev && message.author.id !== Admin) return;

    if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES) || !message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.SEND_MESSAGES)) return;

    message.reply({content: "Xin lỗi vì sự bất tiền này, bot này không thể add khi đạt 100 server nữa! Hãy mời bot mới tại: https://monbot.tk/invite"});

});

client.login("ODM3NTIyMTgzNjQ3MjY0ODA4.YItxUA.GMXVhGI7JQEAOfrn2yUviu8WUKM", console.error);