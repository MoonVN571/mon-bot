const Database = require('simplest.db');
const { Client, Message, Permissions } = require('discord.js');

module.exports = {
    name: "welcome-channel",
    description: "Đặt kênh gửi message này khi có người vào nhóm",
    usage: "<PREFIX>welcome-channel <Tag kênh/ID>",
    ex: "<PREFIX>welcome-channel 000000000000000000",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập kênh để đặt welcome channel.\nCách sử dụng: " + client.prefix + "welcome-channel <tag/id kênh>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!data.get('welcome-channel') && args[0] == "off") {
            return message.reply({
                embeds: [{
                    description: "Bạn chưa đặt kênh welcome nào cả.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        } else if (data.get('welcome-channel') && args[0] == "off") {
            data.delete('welcome-channel');
            return message.reply({
                embeds: [{
                    description: "Bạn đã tắt welcome.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }

        if (data.get("welcome-channel")) return message.reply({
            embeds: [{
                title: client.emoji.success + "Đã đặt kênh!",
                description: "Bạn đã đặt welcome channel. Gõ " + client.prefix + "welcome-channel off - Để tắt tính năng nếu muốn",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        var channels = message.mentions.channels.first() || args[0];
        if(message.mentions.channels.first()) channels = channels.id;
        
        let channelPerm = client.channels.cache.get(channels);

        if (!channelPerm || !channels) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp kênh hợp lệ!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissionsIn(channelPerm).has(Permissions.FLAGS.SEND_MESSAGES)) return message.reply({
            embeds: [{
                description: "Bot không có quyền chat trong kênh này!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        data.set("welcome-channel", channels);

        message.reply({
            embeds: [{
                description: "Bạn đã đặt welcome channel <#" + channels + "> thành công. Bạn có thể liện hệ admin để lấy custom image.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}