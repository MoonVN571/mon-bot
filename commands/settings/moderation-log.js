const { Permissions, Client, Message } = require('discord.js');
const Database = require('simplest.db');

module.exports = {
    name: "moderation-log",
    description: "Xuất dữ liệu từ người dùng",
    usage: "<PREFIX>moderation-log <Tag kênh/ID>",
    ex: "<PREFIX>moderation-log 000000000000000000",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                description: "Bạn không đủ quyền để đặt kênh xuất.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });


        const data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập kênh để đặt kênh moderation.\n\nVí dụ: " + client.prefix + "moderation-log <tag/id kênh>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!data.get('moderation-channel') && args[0] == "off") {
            return message.reply({
                embeds: [{
                    description: "Bạn chưa đặt kênh moderation log nào cả.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        } else if (data.get('moderation-channel') && args[0] == "off") {
            data.delete('moderation-channel');
            return message.reply({
                embeds: [{
                    description: "Bạn đã tắt moderation log thành công!",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }

        if (data.get("moderation-channel")) return message.reply({
            embeds: [{
                description: "Bạn đã đặt kênh moderation log than2h công!\nGõ " + client.prefix + "moderation-log off - Nếu bạn muốn tắt moderation log",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

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
                description: "Bạn phải cấp quyền cho bot chat ở kênh này để đặt kênh!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissionsIn(channelPerm).has(Permissions.FLAGS.VIEW_CHANNEL)) return message.reply({
            embeds: [{
                description: "Bạn phải cấp quyền cho bot xem kênh này!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        data.set("moderation-channel", channels);

        message.reply({
            embeds: [{
                description: "Bạn đã đặt kênh moderation-log tại <#" + channels + "> thành công!",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}