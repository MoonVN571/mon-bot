const { Permissions, Client, Message } = require('discord.js');
const Database = require('simplest.db');

module.exports = {
    name: "log-moderation",
    description: "Xuất dữ liệu từ người dùng",
    usage: "<PREFIX>log-moderation [Tag kênh/ID]",
    ex: "<PREFIX>log-moderation 000000000000000000",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Không đủ quyền",
                description: "Bạn không đủ quyền để đặt kênh xuất.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });


        const data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin",
                description: "Bạn phải nhập kênh để đặt kênh welcome.\n\nVí dụ: " + client.prefix + "log-moderation <tag/id kênh>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!data.get('moderation-channel') && args[0] == "off") {
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Lỗi",
                    description: "Bạn chưa đặt kênh log moderation nào cả.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        } else if (data.get('moderation-channel') && args[0] == "off") {
            data.delete('moderation-channel');
            return message.reply({
                embeds: [{
                    title: client.emoji.success + "Thành công",
                    description: "Bạn đã tắt log-moderation.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }

        if (data.get("moderation-channel")) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Đã đặt kênh",
                description: "Bạn đã đặt kênh xuất hệ thống rồi.\n\n*Gõ " + client.prefix + "log-moderation off để tắt tính năng*",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        var channels = message.mentions.channels.first() || args[0];
        if(message.mentions.channels.first()) channels = channels.id;

        let channelPerm = client.channels.cache.get(channels);

        if (!channelPerm || !channels) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Sai kênh!",
                description: "Kênh bạn cung cấp không hợp lệ!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissionsIn(channelPerm).has(Permissions.FLAGS.SEND_MESSAGES)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu quyền",
                description: "Bot không có quyền chat trong kênh bạn đã cung cấp!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissionsIn(channelPerm).has(Permissions.FLAGS.VIEW_CHANNEL)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu quyền",
                description: "Bot không có quyền xem kênh này!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        data.set("moderation-channel", channels);

        message.reply({
            embeds: [{
                title: client.emoji.success + "Thành công!",
                description: "Bạn đã đặt kênh moderation-log tại <#" + channels + "> thành công.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}