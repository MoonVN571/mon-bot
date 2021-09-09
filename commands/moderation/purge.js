const { Permissions, Client, Message } = require('discord.js');

module.exports = {
    name: "purge",
    description: "Xoá số tin nhắn theo số lượng.",
    aliases: ['clear'],
    usage: "<PREFIX>clear <số tin nhắn>",
    ex: "<PREFIX>clear 20",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền!",
                description: "Bạn không có quyền ``MANAGE_MESSAGES`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền",
                description: "Bạn không có quyền ``MANAGE_MESSAGES`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!args[0]) return message.channel.send({
            embeds: [{
                title: client.emoji.failed + " Thiếu thông tin",
                description: "Bạn phải nhập số lượng tin nhắn cần xoá.\n\nCú pháp: " + client.prefix + "clear <số lượng>",
                footer: "Cú pháp <>: Bắt buộc; []: Không bắt buộc",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        const deleteCount = +args[0];

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.channel.send({
            embeds: [{
                title: client.emoji.failed + " Số lượng sai",
                description: "Bạn chỉ có thể xoá 2 đến 100 tin nhắn trong 1 lần.",
                color: client.config.ERR_COLOR
            }]
        });

        try {
            message.channel.bulkDelete(deleteCount, true).then(() => {
                message.channel.send({
                    embeds: [{
                        title: client.emoji.success + "Thành công",
                        description: "Đã dọn " + args[0] + " tin nhắn!",
                        color: client.config.DEF_COLOR
                    }]
                }).then(msg => setTimeout(() => msg.delete(), 10000));
            }).catch(error => {
                if (error.toString().includes("14 days old")) return message.channel.send({
                    embeds: [{
                        title: client.emoji.failed + " Lỗi!",
                        description: "Không thể xoá tin nhắn đã trên 14 ngày.",
                        color: client.config.ERR_COLOR
                    }]
                });
                console.log(error);
            });

            if(message.deletable) message.delete();
        } catch (e) { console.log(e) }
    }
}