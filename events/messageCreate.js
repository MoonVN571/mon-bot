const axios = require('axios');
const client = require('../index');
const Database = require('simplest.db');
const { calculate } = require('../utils/utils');
const { Admin, dev } = require('../config.json');
const { Collection, Permissions } = require('discord.js');
const delay = new Collection();
client.on('messageCreate', async (message) => {
    if (message.author.bot || message.author === client.user || !message.guild) return;


    const guildID = message.guild.id;
    const authorID = message.author.id;

    const errorInfo = `\`\`Server ID: ${guildID} - Name: ${message.guild.name}\`\``; 

    const isTag = message.mentions.members.first();

    // Ghost ping detector
    let ghostPing = new Database({ path: "./data/guilds/" + guildID + ".json" });

    if (!dev && ghostPing.get("GhostPingDetector.enable") && isTag) {
        if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return client.sendError(`GUILD: ${message.guild.name} - ID: ${message.guild.id}\nText: No Perm to chat`);

        const time = ghostPing.get("GhostPingDetector.time") || 15000;

        client.Pings.set(`pinger:${guildID}${isTag.id}`, Date.now() + time);
        setTimeout(() => {
            client.Pings.delete(`pinger:${guildID}${isTag.id}`);
        }, time);
    }

    // AI Chhannel
    const dataAi = new Database({ path: './data/guilds/' + guildID + '.json' });
    const isAiChannel = dataAi.get("ai-channel");
    const aiLang = dataAi.get("ai-lang");

    if (message.channel.id == isAiChannel) {
        if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return client.sendError(`GUILD: ${message.guild.name} - ID: ${message.guild.id}\nText: No Perm to chat`);

        axios({
            method: "GET",
            url: "https://api.simsimi.net/v2/?text=" + encodeURIComponent(message.content) + "&lc=" + (aiLang ? aiLang : "vn")+ "&cf=true",
        }).then(async callback => {
            if (!callback.data || !callback.data.messages[0]) return;
            await message.channel.send(callback.data.messages[0].text).catch(err => {
                client.sendError("Chat err", err);
            });
        }).catch(e => {
            // console.log(e.toString());
            // if(e.split("").length != 0) client.sendError("Simsimi", e);
        });
    }


    // AFK message
    const afkData = new Database({ path: './data/afk.json' });
    const checkAfk = afkData.get(guildID + "." + authorID + ".loinhan");

    if (checkAfk) {
        if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return client.sendError(`GUILD: ${message.guild.name} - ID: ${message.guild.id}\nText: No Perm to chat`);
        afkData.delete(guildID + "." + authorID + ".afking");
        afkData.delete(guildID + "." + authorID + ".loinhan");
        return message.reply({
            embeds: [{
                description: "Bạn đã trở lại nhóm, đã tắt chế độ afk!",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => setTimeout(() => { msg.delete()}, 20000));
    }

    if (isTag) {
        let checkIsAfk = afkData.get(guildID + "." + isTag.id + '.afking');

        if (checkIsAfk) {
            message.reply({
                embeds: [{
                    description: isTag.toString() + " đang treo từ *" + calculate(afkData.get(guildID + "." + isTag.id + ".thoigian")) + "* nên sẽ không có phản hồi nào.\nLời nhắn: " + afkData.get(guildID + "." + isTag.id + ".loinhan"),
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg,20000));
        }
    }

    // Main
    let dataPrefix = new Database({ path: "./data/guilds/" + guildID + ".json" });
    const prefix = dataPrefix.get("prefix") || client.config.PREFIX;

    if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) return message.reply({
        embeds: [{
            description: "Prefix của server là ``" + prefix + "``.",
            color: client.config.DEF_COLOR
        }], allowedMentions: { repliedUser: false }
    });

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
    if (cmd.dev && Admin !== authorID) return;
    if(dev && message.author.id !== Admin) return;

    client.prefix = prefix;

    if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return client.sendError(`GUILD: ${message.guild.name} - ID: ${message.guild.id}\nText: No Perm to chat`);

    // Delay global
    if (delay.has(message.author.id))
        return message.reply({ content: "Nghỉ tay tí nào, dùng lệnh hơi nhanh rồi đấy!", allowedMentions: { repliedUser: false } });

    delay.set(message.author.id);
    setTimeout(() => delay.delete(message.author.id), 1000);

    if (!cmd.delayAlia) {
        // Delay command
        const timeout = new Database({ path: "./data/delay.json" });

        let cmdDelay = client.commands.get(cmdName);
        if (!cmdDelay) cmdDelay = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if (timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now() < 0
            || !timeout.get(`${message.author.id}.${cmdDelay.name}`)) timeout.delete(`${message.author.id}.${cmdDelay.name}`);

        let calc = calculate(timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now());
        if (/*client.config.ADMINS.indexOf(message.author.id) < 0 &&*/ timeout.get(`${message.author.id}.${cmdDelay.name}`) && calc) {
            return message.reply({content: `Dừng tay tí nào, hãy chờ \`\`${calc}\`\` để tiếp tục dùng lệnh này.`, allowedMentions: { repliedUser: false }})
                .then(msg =>client.msgDelete(msg, 2000));
        }

        setTimeout(() => timeout.delete(`${message.author.id}.${cmdDelay.name}`), (cmdDelay.delay ? cmdDelay.delay : 3) * 1000);
        timeout.set(`${message.author.id}.${cmdDelay.name}`, Date.now() + (cmdDelay.delay ? cmdDelay.delay : 3) * 1000);
    } else {

    }

    function botError() {
        console.log(cmdName);
        message.reply({
            embeds: [{
                description: "Hệ thống gặp lỗi thử lại sau!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 2000));
    }
    message.botError = botError;
    message.errorInfo = cmd.name + " | " + errorInfo;

    client.sendLog(`[${new Date().toLocaleString()}] ${message.guild.name} | ${message.channel.name} | ${message.author.tag} - ${message.author.id} : ${message.content}`);

    cmd.execute(client, message, args);
});