const Database = require('simplest.db');
const { Permissions } = require('discord.js');
const axios = require('axios');
module.exports = {
    name: "tts-language",
    description: "Thay đôi ngôn ngữ TTS",
    delay: 5,
    usage: "<PREFIX>tts-language <ngôn ngữ>",
    ex: "<PREFIX>tts-language vn",

    execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        const data = new Database({ path: "./data/guilds/" + message.guild.id + ".json" });

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập ngôn ngữ.\nCách sử dụng: " + client.prefix + "tts-language <ngôn ngữ>",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let check = data.get("tts-lang");

        if (check && args[0] == check) return message.reply({
            embeds: [{
                description: "Bạn đã đặt ngôn ngữ này cho server rồi.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (args.length > 1) return message.reply({
            embeds: [{
                description: "Ngôn ngữ không hỗ trợ.\nGõ " + client.prefix + "tts-language list để xem ngôn ngữ có sẵn",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        
        axios({
            method: "get",
            url: `https://translate.google.com/translate_tts?ie=UTF-8&q=2&tl=${args[0]}&total=1&idx=0&textlen=1&client=tw-ob&prev=input&ttsspeed=1`
        }).then(() => {
            data.set("tts-lang", args[0]);

            message.reply({
                embeds: [{
                    description: "Đã đặt tts language là **" + args[0] + "**.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }).catch(err => {
            if(err.message == "Request failed with status code 400") return message.reply({
                embeds: [{
                    description: "Ngôn ngữ không hợp lệ!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));
            message.botError();
            client.sendError(message.errorInfo, err);
        });
    }
}