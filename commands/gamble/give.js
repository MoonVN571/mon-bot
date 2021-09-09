const Database = require('simplest.db');
const { Client, Message } = require('discord.js');

module.exports = {
    name: "give",
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
                title: client.emoji.failed + "Thiếu người nhận",
                description: "Bạn cần đề cập người nhận để chuyển tiến",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // check number at 0 or 1
        let toCheck = +args[0];
        if (isNaN(+args[0])) toCheck = +args[1];

        // check user money and send
        const userMoney = new Database({ path: './data/eco/' + message.author.id + '.json' });
        let pays = userMoney.get("money");

        if (!user || !args[1] || !args[0] || !user || isNaN(toCheck) || toCheck > pays)
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Thiếu thông tin!",
                    description: "Bạn phải nhập người nhận và số tiền cần give.",
                    color: "f10f0f"
                }], allowedMentions: false
            });


        // add tien cho user nhan tien
        const userLay = new Database({ path: "./data/eco/" + user.user.id + '.json' });
        userLay.number.add("money", toCheck);

        // tru tien user pay
        userMoney.number.subtract('money', toCheck);

        message.reply({
            emnbeds: [{
                title: client.emoji.success + "Chuyển tiền thành công!",
                description: "Bạn đã chuyển cho " + user.user.toString() + " số tiền là " + toCheck + client.emoji.dongxu + ".",
                color: "0FF1CE"
            }], allowedMentions: { repliedUser: false }
        });
    }
}