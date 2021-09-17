const Database = require('simplest.db');
const { Client, Message, Permissions } = require('discord.js');

module.exports = {
    name: "warn",
    description: "Cảnh cáo một người dùng",
    usage: "<PREFIX>warn <tag/id> <lí do>",
    ex: "<PREFIX>warn <BOT_MENTIONS> Vi phạm luật",
    // aliases: ['warni']
    delay: 3,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
        ) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng cần cảnh cáo.\nCách sử dụng: " + client.prefix + "warn <tag/id> <lí do>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // check member

        const reason = args.join(" ").split(args[0] + " ")[1];

        if (!args[1] || !reason) return message.reply({
            embeds: [{
                description: "Hãy cung cấp lí do cảnh cáo.\nCách sử dụng: " + client.prefix + "warn <tag/id> <lí do>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });


        var warnUser = message.mentions.members.first() || args[0];
        if (warnUser) warnUser = warnUser.id;

        const member = message.guild.members.cache.get(warnUser);
        if (member.user.bot) return message.reply({
            embeds: [{
                description: "Bạn không thể cảnh cáo bot.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (member.user == message.author) return message.reply({
            embeds: [{
                description: "Bạn không thể cảnh cáo chính mình.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!member) return message.reply({
            embeds: [{
                description: "Không tìm thấy người này trong server.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // lay guild id
        const dataWarn = new Database({ path: "./data/warnings/" + message.guild.id + ".json" });
        let userWarns = dataWarn.get(member.user.id) || "đầu";

        dataWarn.number.add(member.user.id, 1);

        message.reply({
            embeds: [{
                title: client.emoji.success + "Thành công!",
                description: "Bạn đã cảnh cáo **" + member.user.tag + "** lần " + userWarns + " với lí do: " + reason,
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}