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
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập kênh để setup.\n\nVí dụ: " + client.prefix + "chat-bot <tag/id kênh>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!data.get('ai-channel') && args[0] == "off") {
            return message.reply({
                embeds: [{
                    description: "Bạn chưa đặt kênh chat bot nào cả!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));
        } else if (data.get('ai-channel') && args[0] == "off") {
            data.delete('ai-channel');
            return message.reply({
                embeds: [{
                    description: "Đã tắt chat bot tại kênh này.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }

        if (data.get("ai-channel")) return message.reply({
            embeds: [{
                description: "Bạn đã đặt kênh chat bot.\nGõ " + client.prefix + "chat-bot off - Nếu bạn muốn tắt chat bot",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        var channels = message.mentions.channels.first() || args[0];
        if(message.mentions.channels.first()) channels = channels.id;

        let channelPerm = client.channels.cache.get(channels);

        if (!channelPerm || !channels) return message.reply({
            embeds: [{
                description: "Kênh bạn cung cấp không hợp lệ!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissionsIn(channelPerm).has(Permissions.FLAGS.SEND_MESSAGES)) return message.reply({
            embeds: [{
                description: "Bot không có quyền chat trong kênh bạn đã cung cấp!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        data.set("ai-channel", channels);

        message.reply({
            embeds: [{
                description: "Bạn đã đặt kênh chat bot tại <#" + channels + ">.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}