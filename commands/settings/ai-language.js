const Database = require('simplest.db');
const { Permissions } = require('discord.js');

module.exports = {
    name: "ai-language",
    description: "Thay đôi ngôn ngữ AI chat",
    delay: 5,
    usage: "<PREFIX>ai-language <ngôn ngữ>",
    ex: "<PREFIX>ai-language vn",

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
                description: "Bạn phải nhập ngôn ngữ.\nCách sử dụng: " + client.prefix + "ai-language <ngôn ngữ>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let check = data.get("ai-lang");

        if (check && args[0] == check) return message.reply({
            embeds: [{
                description: "Bạn đã đặt ngôn ngữ này cho server rồi.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (args.length > 1) return message.reply({
            embeds: [{
                description: "Ngôn ngữ không hỗ trợ.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        
        axios({
            method: "get",
            url: "https://api.simsimi.net/v2/?text=checkailang&lc=" + args[0],
            headers: {
                "Content-Type": "application/json",
                "Accept": "x-www-form-urlencoded"
            }
        }).then(callback => {
            if (!callback.data.success) return message.reply({
                embeds: [{
                    description: "Bot lỗi hãy thử lại sau ít phút!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

            if(callback.data.lc == "en" && args[0] != "en") return message.reply({
                embeds: [{
                    description: "Ngôn ngữ không hợp lệ!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

            data.set("ai-lang", args[0]);

            message.reply({
                embeds: [{
                    description: "Đã đặt ai language là **" + args[0] + "**.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }).catch(e => {
            // console.log(e.toString());
            client.sendError(message.errorInfo, e);
        });
    }
}