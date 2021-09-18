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
        setTimeout(() => { if(message.deletable) message.delete() }, 500);

        if (!args[0])
            return message.reply({
                embeds: [{
                    description: "Cung cấp đơn vị thời gian theo tiếng Anh.\nCách sử dụng: " + client.prefix + "start <thời gian> <số người win> <giải thưởng>",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        if (!args[1])
            return message.reply({
                embeds: [{
                    description: "Cung cấp số người thắng.\nCách sử dụng: " + client.prefix + "start <thời gian> <số người win> <giải thưởng>",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        const thoi_han = ms(args[0], { long: true });
        if (!thoi_han)
            return message.reply({
                embeds: [{
                    description: "Thời gian không hỗ trợ.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        if (isNaN(+args[1]))
            return message.reply({
                embeds: [{
                    description: "Cung cấp số người có thể thắng",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        const qua_tang = args.join(" ").split(args[0] + " " + args[1] + " ")[1];

        if (!qua_tang)
            return message.reply({
                embeds: [{
                    description: "Cung cấp giải thưởng.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        client.giveawaysManager.start(message.channel, {
            duration: thoi_han,
            winnerCount: +args[1],
            prize: qua_tang,
            hostedBy: message.author.toString(),
            messages: {
                giveaway: "**GIVEAWAY** đã bắt đầu!",
                giveawayEnded: "**GIVEAWAY** đã kết thúc!",
                winMessage: {
                    content: "Chúc mừng, \n{winners}\n\nGiải thưởng: **{this.prize}**! Được tổ chức bởi: **{this.hostedBy}**\n*Đi đến giveaway: {this.messageURL}*",
                    // embed: new MessageEmbed()
                    //     .setDescription("[Chuyển đến tin nhắn]({this.messageURL})").setColor("303136")
                },
                inviteToParticipate: "<a:click:888798426593116160> React " + client.emoji.hopqua + " để tham gia",
                embedFooter: {
                    text: "Sẽ có {this.winnerCount} người thắng.",
                    iconURL: client.emoji.gaLinkFooter
                },
                noWinner: "<:winner:888798424143642634> **Không** có ai tham gia",
                winners: "<:winner:888798424143642634> **Người thắng:**\n",
                endedAt: "Đã quay thưởng {this.winnerCount} giải",
                drawing: "**Kết thúc trong:** {timestamp}",
                hostedBy: "Được tổ chức bởi {this.hostedBy}"    
            },
        }).then((gData) => {
            const data = new Database({ path: './data/giveaway/author.json' });
            data.set(gData.messageId, message.author.id);
        });
    }
}