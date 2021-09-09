const Database = require('simplest.db');
const axios = require('axios');

const { calculate } = require('../utils/utils');
const { Admin, Whitelist, dev } = require('../config.json');

const client = require('../index');
const { Permissions } = require('discord.js');

client.on('messageCreate', async (message) => {
    if (message.author.bot || message.author === client.user || !message.guild) return;
    
    const guildID = message.guild.id;
    const authorID = message.author.id;

    const isTag = message.mentions.members.first();

    // Ghost ping detector
    let ghostPing = new Database({ path: "./data/guilds/" + guildID + ".json" });

    if (!dev && ghostPing.get("GhostPingDetector.enable") && isTag) {
        const time = ghostPing.get("GhostPingDetector.time") || 15000;

        client.Pings.set(`pinger:${guildID}${isTag.id}`, Date.now() + time);
        setTimeout(() => {
            client.Pings.delete(`pinger:${guildID}${isTag.id}`);
        }, time);
    }

    // AI Chhannel
    const dataAi = new Database({ path: './data/guilds/' + guildID + '.json' });
    const isAiChannel = dataAi.get("ai-channel");

    if (message.channel.id == isAiChannel) {
        axios({
            method: "get",
            url: "https://api.simsimi.net/v1/?text=" + encodeURIComponent(message.content) + "&lang=vi_VN",
            headers: {
                "Content-Type": "application/json",
                "Accept": "x-www-form-urlencoded"
            }
        }).then(callback => {
            if (!callback.data.success) return;
            console.log(callback.data.success);
            message.channel.send(callback.data.success).catch(err => {
                client.sendError(err);
            })
        }).catch(e => {
            // console.log(e.toString());
            client.sendError(e);
        });
    }


    // AFK message
    const afkData = new Database({ path: './data/afk.json' });
    const checkAfk = afkData.get(guildID + "." + authorID + ".loinhan");

    if (checkAfk) {
        afkData.delete(guildID + "." + authorID + ".afking");
        afkData.delete(guildID + "." + authorID + ".loinhan");
        return message.reply({
            embeds: [{
                title: "AFK",
                description: "Bạn đã trở lại nhóm, đã tắt chế độ afk!",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => setTimeout(() => msg.delete(), 20000));
    }

    if (isTag) {
        let checkIsAfk = afkData.get(guildID + "." + isTag.id + '.afking');

        if (checkIsAfk) {
            message.reply({
                embeds: [{
                    title: "AFK",
                    description: isTag.toString() + " đang treo từ *" + calculate(afkData.get(guildID + "." + isTag.id + ".thoigian")) + "* nên sẽ không có phản hồi nào.\nLời nhắn: " + afkData.get(guildID + "." + isTag.id + ".loinhan"),
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => setTimeout(() => msg.delete(), 20000));
        }
    }

    // Anti raid
    /**
     * isTag : User mentioned
     * 
     * Check data spam mode than about 3s
     */



    //  if(authorID) console.log(client.mentions)

    /*
    const roleMentioned = message.mentions.roles.first();
    if(isTag || roleMentioned) {
        // map user
        // message.mentions.members.map(m => m.user.username);
        // console.log(message.mentions.roles.map(r => r.name));

        // check timeout time next mention

        // set time to next mention
        console.log(message.mentions.members.array().length)
        return;
        let totalMention = message.mentions.members.each(m => m.user.id).length + message.mentions.roles.map(r => r.name).length;

        // if(Admin !== authorID) return;
        console.log(totalMention);

        // check count user if > 3;
        if(totalMention > 3) punish();

        // add count mention for next
        
        // client.mentions.add(guildID + "." + authorID);
        // if(client.mentions.has(guildID + "." + authorID)) client.mentions.add(guildID + "." + authorID + ".1");

        // if(message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

        // console.log(client.mentions);
        setTimeout(() => client.mentions.delete(guildID + "." + authorID), 3 * 1000);
    } 

    function punish() {
        console.log("Should punished")
        message.channel.send("Shold punish")
    } */


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

    client.sendLog(`[${new Date().toLocaleString()}] ${message.guild.name} || ${message.channel.name} || ${message.author.tag} - ${message.author.id} : ${message.content}`);

    var args = message.content.slice(prefix.length).split(/ +/);
    if (args[0] == "") args = args.slice(1);
    if (!args.length) return;

    let cmdName = args.shift().toLowerCase();

    var cmd = client.commands.get(cmdName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if (!cmd) return;

    if (prefix == ";;" && dev && !(Admin === authorID)) return;

    if (cmd.discordDev && Whitelist !== guildID) return message.reply({
        embeds: [{
            title: "ERROR",
            description: "Lệnh đã được tắt ở server này.",
            color: client.config.ERR_COLOR
        }], allowedMentions: { repliedUser: false }
    });

    if (cmd.disabled) return;
    if (cmd.dev && Admin !== authorID) return;

    /*
    if(cmd.admin && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({embeds: [{
        title: "ERROR",
        description: "Bạn không được phép sử dụng lệnh này.",
        color: client.config.ERR_COLOR
    }]});
    */

    client.prefix = prefix;

    // Delay command
    const timeout = new Database({ path: "./data/delay.json" });

    let cmdDelay = client.commands.get(cmdName);
    if (!cmdDelay) cmdDelay = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if (timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now() < 0 
    || !timeout.get(`${message.author.id}.${cmdDelay.name}`)) timeout.delete(`${message.author.id}.${cmdDelay.name}`);

    let calc = calculate(timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now());
    if (/*client.config.ADMINS.indexOf(message.author.id) < 0 &&*/ timeout.get(`${message.author.id}.${cmdDelay.name}`) && calc) return message.reply({
        embeds: [{
            title: "Rate limit",
            description: `Bạn cần chờ \`\`${calc}\`\` để tiếp tục dùng lệnh này.`,
            color: client.config.ERR_COLOR
        }], allowedMentions: { repliedUser: false }
    });

    setTimeout(() => timeout.delete(`${message.author.id}.${cmdDelay.name}`), (cmdDelay.delay ? cmdDelay.delay : 3) * 1000);
    timeout.set(`${message.author.id}.${cmdDelay.name}`, Date.now() + (cmdDelay.delay ? cmdDelay.delay : 3) * 1000);

    /*

    let serverData = await db.get(guildID);
    if (!serverData) serverData = await db.set(message.guild.id, { prefix: TYPE_RUN == 'production' ? "_" : "*", logchannel: null, msgcount: true, defaulttts: null, botdangnoi: false, aiChannel: null, msgChannelOff: [], blacklist: false, aiLang: 'vi', noitu: null, noituStart: false, noituArray: [], maxWords: 1500, noituLastUser: null, rankChannel: 'default' });
    const { msgChannelOff, aiChannel, aiLang, noitu, noituStart, noituArray, maxWords, noituLastUser, rankChannel } = serverData;
    */

    const serverData = {
        prefix: prefix,
        guildId: guildID
    }

    function commandError() {
        console.log(cmdName);
        message.reply({
            embeds: [{
                title: client.emoji.failed + "Lỗi",
                description: "Hệ thống gặp lỗi thử lại sau!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }

    message.botError = commandError;

    try {
        cmd.execute(client, message, args, serverData);
    } catch (err) {
        console.log(err);
        message.reply({
            embeds: [{
                title: "ERROR",
                description: "Không thể thực hiện lệnh này, thử lại sau!",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
});