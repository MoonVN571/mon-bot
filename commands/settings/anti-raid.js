const { Client, Message } = require('discord.js');
const Database = require('simplest.db');

module.exports = {
    name: "anti-raid",
    description: "Bật tính năng chống raid server.",
    usage: "<PREFIX>anti-raid <mode> <on/off>",
    ex: "<PREFIX>anti-raid on\n<PREFIX>anti-raid off",
    delay: 3,
    disabled: true,
    
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu quyền!",
                description: "Bạn không có quyền ``MANAGE_GUILD`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // global data
        const data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0] || !(args[0] == "on" || args[0] == "off")) return message.reply({
            embeds: [{
                description: "Bạn phải nhập on hoặc off để bật hoặc tắt tính năng.\n\nVí dụ: " + client.prefix + "anti-raid <on/off>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // get value from data
        let check = data.get("Ant-Raid.enable");

        if (check && args[0] == "on") return message.reply({
            embeds: [{
                title: client.emoji.failed + "Đang bật!",
                description: "Bạn đã bật tính năng này rồi.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!check && args[0] == "off") return message.reply({
            embeds: [{
                title: client.emoji.failed + "Đang tắt!",
                description: "Bạn đã tắt tính năng này rồi.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // // // // //
        //  BOOLEAN //
        // // // // //

        if (args[0] == "on") {
            message.reply({
                embeds: [{
                    title: "Cài đặt",
                    description: "Bạn đã bật tính năng ``Anti Raid``.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            data.set("Anti-Raid.enable", true);
        }

        if (args[0] == "off") {
            message.reply({
                embeds: [{
                    title: "Cài đặt",
                    description: "Bạn đã tắt tính năng ``Anti Raid``.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            data.set("Anti-Raid.enable", false);
        }
    }
}