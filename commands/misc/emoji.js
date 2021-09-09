const { Client, Message, Util } = require('discord.js');

module.exports = {
    name: "emoji",
    description: "Phóng to emoji của bạn",
    delay: 10,
    usage: "<PREFIX>emoji [emoji]",
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
                title: client.emoji.failed + " Thiếu thông tin!",
                description: "Bạn phải nhập emoji cần phógn to.\n\nCâu lệnh: " + client.prefix + "emoji <emoji>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // https://discord.com/assets/2312e90b9fc75749149a200817b952f2.svgs
        let emoji = Util.parseEmoji(args[0]);

        if (!emoji.id) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Emoji lỗi!",
                description: "Bạn phải nhập emoji từ server tải lên.\n\nCâu lệnh: " + client.prefix + "emoji <emoji>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (emoji.id) emoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;

        message.reply({
            embeds: [{
                title: "Emoji ID: " + emoji.id,
                image: { url: emoji },
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

    }
}