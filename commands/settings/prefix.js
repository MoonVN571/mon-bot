const Database = require('simplest.db');
const { Permissions } = require('discord.js');

module.exports = {
    name: "prefix",
    description: "Thay đôi prefix bot",
    delay: 5,
    usage: "<PREFIX>prefix <prefix mới>",
    ex: "<PREFIX>prefix ;",

    execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập prefix cần thay đổi.\nCách sử dụng: " + client.prefix + "prefix <prefix mới>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (args.length > 1 || args[0].length > 3) return message.reply({
            embeds: [{
                description: "Bot không hỗ trợ prefix này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        message.reply({
            embeds: [{
                description: "Bạn đã đặt prefix mới cho server là ``" + args[0] + "``.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        data.set("prefix", args[0]);
    }
}