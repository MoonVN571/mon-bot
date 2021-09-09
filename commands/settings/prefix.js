const Database = require('simplest.db');
const { Permissions } = require('discord.js');

module.exports = {
    name: "prefix",
    description: "Thay đôi prefix bot",
    delay: 5,
    usage: "<PREFIX>prefix [prefix mới]",
    ex: "<PREFIX>prefix ;",

    execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu quyền",
                description: "Bạn không có quyền ``MANAGE_GUILD`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin",
                description: "Bạn phải nhập prefix cần thay đổi.\n\nVí dụ: " + client.prefix + "prefix <prefix mới>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let check = data.get("Prefix");

        if (check && args[0] == check) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Đã đặt prefix",
                description: "Bạn đã đặt prefix này cho server rồi.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (args.length > 1) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thừa dữ liệu",
                description: "Bạn đã nhập dạng prefix bot không hỗ trợ.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        message.reply({
            embeds: [{
                title: client.emoji.success + "Đã đặt prefix!",
                description: "Bạn đã đặt prefix mới cho server là ``" + args[0] + "``.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        data.set("prefix", args[0]);
    }
}