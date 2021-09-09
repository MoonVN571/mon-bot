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
                title: "Thiếu quyền!",
                description: "Bạn không có quyền ``MANAGE_GUILD`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0] || !(args[0] == "on" || args[0] == "off")) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin",
                description: "Bạn phải nhập on hoặc off để bật hoặc tắt tính năng.\n\nVí dụ: " + client.prefix + "ghost-ping <on/off>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let check = data.get("GhostPingDetector.enable");

        if (check && args[0] == "on") return message.reply({
            embeds: [{
                title: client.emoji.failed + "Đã bật",
                description: "Bạn đã bật tính năng này rồi.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });


        if (!check && args[0] == "off") return message.reply({
            embeds: [{
                title: client.emoji.failed + "Đã tắt",
                description: "Bạn đã tắt tính năng này rồi.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (args[0] == "on") {
            message.reply({
                embeds: [{
                    title: client.emoji.success + "Mở thành công",
                    description: "Bạn đã bật tính năng ``Ghost Ping Detector``.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            data.set("GhostPingDetector.enable", true);
        }

        if (args[0] == "off") {
            message.reply({
                embeds: [{
                    title: client.emoji.success + "Tắt thành công",
                    description: "Bạn đã tắt tính năng ``Ghost Ping Detector``.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            data.set("GhostPingDetector.enable", false);
        }
    }
}