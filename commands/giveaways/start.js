const ms = require('ms');
const { Client, Message, MessageEmbed } = require('discord.js');
const Database = require('simplest.db');

module.exports = {
    name: "start",
    description: "Tạo giveaway cho chính bạn",
    ex: "<PREFIX>start 1h1m1s 10 Card Viettel 10k :))",
    usage: "<PREFIX>start <thời gian> <số người win>w <giải thưởng>",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!args[0] || !args[1]) return await message.invalidUsage();

        const thoi_han = ms(args[0], { long: true });
        if (!thoi_han || thoi_han < 5000 || thoi_han > 86400000 * 7)
            return message.reply({
                embeds: [{
                    description: "Thời gian không hỗ trợ.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

        if (args[1] && !(!isNaN(args[1].split("w")[0])
        && args[1] == args[1].split("w")[0] + "w"
        || args[1] == args[1].split("w")[0] + "winner" || args[1] == args[1].split("w")[0] + "winners"))
            return await message.invalidUsage();
        
        const qua_tang = args.join(" ").split(args[0] + " " + args[1] + " ")[1];
        if (!qua_tang) return await message.invalidUsage();

        setTimeout(() => { if(message.deletable) message.delete() }, 500);

        client.giveawaysManager.start(message.channel, {
            duration: thoi_han,
            winnerCount: +args[1].split("w")[0],
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