const Database = require('simplest.db');
const { Client, Message } = require('discord.js');
module.exports = {
    name: "give",
    description: "Chuyển tiền của bạn cho người khác",
    aliases: ['pay'],
    delay: 3,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        let user = message.mentions.members.first();

        if (!user) return message.reply({
            embeds: [{
                description: "Bạn cần đề cập người nhận để chuyển tiến",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // check number at 0 or 1
        let toCheck = +args[0];
        if (isNaN(+args[0])) toCheck = +args[1];

        // check user money and send
        const userMoney = new Database({ path: './data/eco/' + message.author.id + '.json' });
        let pays = userMoney.get("money");

        if (!user || !args[1] || !args[0] || !user || isNaN(toCheck) || toCheck > pays || user.user.bot)
            return message.reply({
                embeds: [{
                    description: "Bạn phải đề cập người nhận và số tiền give hợp lệ.",
                    color: "f10f0f"
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));


        // add tien cho user nhan tien
        const userLay = new Database({ path: "./data/eco/" + user.user.id + '.json' });
        userLay.number.add("money", toCheck);

        // tru tien user pay
        userMoney.number.subtract('money', toCheck);

        message.reply({
            embeds: [{
                description: "Bạn đã chuyển cho " + user.user.toString() + " số tiền " + Intl.NumberFormat().format(toCheck) + " " + client.emoji.dongxu + ".",
                color: "0FF1CE"
            }], allowedMentions: { repliedUser: false }
        });
    }
}