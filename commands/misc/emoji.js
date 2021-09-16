const { Client, Message, Util } = require('discord.js');
const { parse } = require('twemoji-parser');

module.exports = {
    name: "emoji",
    description: "Phóng to emoji của bạn",
    delay: 10,
    usage: "<PREFIX>emoji <emoji>",
    ex: "<PREFIX>emoji <:MonkaChrist:882606231343210526>",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập emoji cần phóng to.\n\nCách sử dụng: " + client.prefix + "emoji <emoji>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let emoji = Util.parseEmoji(args[0]);

        if (emoji.id) {
            message.reply({
                embeds: [{
                    title: "Emoji ID: " + emoji.id,
                    image: { url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}` },
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        } else {
            const parsed = parse(emoji, { assetType: "png" });
            if (!parsed[0]) {
                client.sendError("Emoji can not parse: " + parsed);
                return message.reply({
                    embeds: [{
                        description: "Emoji cung cấp không hợp lệ thử lại sau!",
                        color: client.config.ERR_COLOR
                    }], allowedMentions: { repliedUser: false }
                }).then(msg => client.msgDelete(msg));
            } else {
                message.reply({
                    embeds: [{
                        title: "Emoji mặc định",
                        image: { url: parsed[0].url },
                        color: client.config.DEF_COLOR
                    }], allowedMentions: { repliedUser: false }
                });
            }
        }
    }
}