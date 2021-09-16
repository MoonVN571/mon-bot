const Database = require('simplest.db');
const { Permissions } = require('discord.js');

module.exports = {
    name: "ghost-ping",
    description: "Chặn ghost ping người khác",
    delay: 5,
    usage: "<PREFIX>ghost-ping [on/off]",
    ex: "<PREFIX>ghost-ping on",

    execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0] || !(args[0] == "on" || args[0] == "off")) return message.reply({
            embeds: [{
                description: "Bạn phải nhập on hoặc off để bật hoặc tắt tính năng.\nCách sử dụng: " + client.prefix + "ghost-ping <on/off>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let check = data.get("GhostPingDetector.enable");

        if (check && args[0] == "on") return message.reply({
            embeds: [{
                description: "Bạn đã bật tính năng này, gõ " + client.prefix + "ghost-ping off để tắt.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });


        if (!check && args[0] == "off") return message.reply({
            embeds: [{
                description: "Tính năng này chưa được bật.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (args[0] == "on") {
            message.reply({
                embeds: [{
                    description: "Bạn đã bật ``Ghost Ping Detector``, gõ " + client.prefix + "ghost-ping off để tắt.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            data.set("GhostPingDetector.enable", true);
        }

        if (args[0] == "off") {
            message.reply({
                embeds: [{
                    description: "Bạn đã tắt ``Ghost Ping Detector`` thành công!",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            data.set("GhostPingDetector.enable", false);
        }
    }
}