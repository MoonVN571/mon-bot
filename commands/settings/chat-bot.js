const Database = require('simplest.db');
const { Permissions, Client, Message } = require("discord.js");

module.exports = {
    name: "chat-bot",
    description: "Đặt kênh chat bot cho server",
    delay: 5,
    usage: "<PREFIX>chat-bot <tag/id kênh>",
    ex: "<PREFIX>chat-bot 000000000000000000",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu quyền!",
                description: "Bạn không có quyền ``MANAGE_GUILD`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu kênh!",
                description: "Bạn phải nhập kênh để setup.\n\nVí dụ: " + client.prefix + "chat-bot <tag/id kênh>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!data.get('ai-channel') && args[0] == "off") {
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Setup lỗi!",
                    description: "Bạn chưa đặt kênh chat bot nào cả.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        } else if (data.get('ai-channel') && args[0] == "off") {
            data.delete('ai-channel');
            return message.reply({
                embeds: [{
                    title: client.emoji.success + "Tắt thành công!",
                    description: "Bạn đã tắt tính năng chat bot.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }

        if (data.get("ai-channel")) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Đã setting",
                description: "Bạn đã đặt kênh chat bot.\n\n*Gõ " + client.prefix + "chat-bot off để tắt cài đặt*",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        var channels = message.mentions.channels.first() || args[0];
        if(message.mentions.channels.first()) channels = channels.id;

        let channelPerm = client.channels.cache.get(channels);

        if (!channelPerm || !channels) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Lỗi kênh",
                description: "Kênh bạn cung cấp không hợp lệ!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissionsIn(channelPerm).has(Permissions.FLAGS.SEND_MESSAGES)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Lỗi kênh",
                description: "Bot không có quyền chat trong kênh bạn đã cung cấp!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        data.set("ai-channel", channels);

        message.reply({
            embeds: [{
                title: client.emoji.success + "Thành công!",
                description: "Bạn đã đặt kênh chat bot tại <#" + channels + ">.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}