const ms = require('ms');
const { Client, Message, MessageEmbed } = require('discord.js');
const Database = require('simplest.db');

module.exports = {
    name: "start",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        // start-giveaway 2d 1 Awesome prize!
        // Will create a giveaway with a duration of two days, with one winner and the prize will be "Awesome prize!"

        // delete author msessage after 1s
        setTimeout(() => message.delete(), 500);

        if (!args[0])
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Thiếu thông tin!",
                    description: "Cung cấp đơn vị thời gian theo tiếng Anh.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        if (!args[1])
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Thiếu thông tin!",
                    description: "Cung cấp số người thắng.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        const thoi_han = ms(args[0], { long: true });
        if (!thoi_han)
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Sai thông tin!",
                    description: "Thời gian không hỗ trợ.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        if (isNaN(+args[1]))
            return message.reply({
                embeds: [{
                    title: client.emojs.failed + "Sai thông tin!",
                    description: "Cung cấp số người có thể thắng.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        const qua_tang = args.join(" ").split(args[0] + " " + args[1] + " ")[1];

        if (!qua_tang)
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Thiếu thông tin!",
                    description: "Cung cấp giải thưởng.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        client.giveawaysManager.start(message.channel, {
            duration: thoi_han,
            winnerCount: +args[1],
            prize: qua_tang,
            hostedBy: message.author.toString(),
            messages: {
                giveaway: "**GIVEAWAY** đã bắt đầu!",
                giveawayEnded: "**GIVEAWAY** đã kết thúc!",
                winMessage: {
                    content: "Chúc mừng! {winners}, các bạn đã trúng: **{this.prize}**!",
                    embed: new MessageEmbed()
                        .setDescription("[Chuyển đến tin nhắn]({this.messageURL})").setColor("2C2F33")
                },
                dropMessage: "Bấm vào 🎉 để tham gia!",
                inviteToParticipate: "Bấm vào 🎉 để tham gia!",
                embedFooter: "Sẽ có {this.winnerCount} người thắng.",
                noWinner: "Không có ai tham gia cả, GA đã bị huỷ!",
                winners: "Người: ",
                endedAt: "Kết thúc vào",
                drawing: "Kết thúc: {timestamp}",
                hostedBy: "Tổ chức bởi: {this.hostedBy}"
            },
        }).then((gData) => {
            const data = new Database({ path: './data/giveaway/author.json' });
            data.set(gData.messageId, message.author.id);
        })
    }
}