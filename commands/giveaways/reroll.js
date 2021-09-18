const { Client, Message, MessageEmbed } = require('discord.js');
const Database = require('simplest.db');
module.exports = {
    name: "reroll",
    aliases: ['rr'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        // check author
        const dataAuthor = new Database({ path: "./databases/giveaway/author.json" });

        // check author of message id
        if (dataAuthor.get(args[0]) != message.author.id)
            return message.reply({
                embeds: [{
                    description: "Bạn không sỡ hữu giveaway này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        if (!args[0])
            return message.reply({
                embeds: [{
                    description: "Cung cấp ID tin nhắn giveaway.\nCách sử dụng: " + client.prefix + "rr <ID>",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        if (isNaN(+args[0]))
            return message.reply({
                embeds: [{
                    description: "Bạn phải cung cấp ID hợp lệ.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        client.giveawaysManager.reroll(args[0], {
            messages: {
                congrat: { content: 'Chúc mừng, {winners}! Bạn đã trúng giveaway: **{this.prize}**!', embeds: new MessageEmbed().setDescription("[Chuyển đến tin nhắn]({this.messageURL})").setColor("2C2F33") },
                error: 'Không có người thắng mới nào cả.'
            }
        }).then(() => {
            message.reply({
                embeds: [{
                    title: client.emojis.success + "Rerolled!",
                    description: "Bạn đã reroll giveaway này thành công!",
                    COLOR: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }).catch((err) => {
            client.sendError(message.errorInfo, err);
            message.botError();
        });
    }
}