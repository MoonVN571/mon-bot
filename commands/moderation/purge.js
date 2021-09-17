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
                description: "Bạn không có quyền ``Quản lí Tin nhắn`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Tin nhắn`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập số lượng tin nhắn cần xoá.\nCách sử dụng: " + client.prefix + "clear <số lượng>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        const deleteCount = +args[0];

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply({
            embeds: [{
                description: "Bạn chỉ có thể xoá 2 đến 100 tin nhắn trong 1 lần.",
                color: client.config.ERR_COLOR
            }]
        }).then(msg => client.msgDelete(msg, 5000));

        try {
            message.channel.bulkDelete(deleteCount).then(() => {
                message.channel.send("Đã dọn được ``" + deleteCount + "tin nhắn``!").then(msg => client.msgDelete(msg, 10000));
            }).catch(error => {
                if (error.toString().includes("14 days old")) return message.channel.send({
                    embeds: [{
                        description: "Không thể xoá tin nhắn đã trên 14 ngày.",
                        color: client.config.ERR_COLOR
                    }]
                }).then(msg => client.msgDelete(msg, 5000));
                console.log(error);
                client.sendError(`${message.errorInfo} Can not bulk delete: \`\`\`${error}\`\`\``);
            });

            if(message.deletable) message.delete();
        } catch (e) { 
            client.sendError(`Purge catch error: \`\`\`${e}\`\`\``);
            message.botError();
        }
    }
}