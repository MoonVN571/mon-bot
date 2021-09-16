const { Client, Message } = require('discord.js');
const { addMoney } = require('../../utils/eco');
const { sodep } = require('../../utils/utils');
module.exports = {
    name: "addmoney",
    description: "Thêm tiền cho ai đó",
    usage: "<PREFIX>addmoney <User/ID> <Số tiền>",
    ex: "<PREFIX>addmoney @MoonU 100000",
    dev: true,
    aliases: ['am'],

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        if (!args[0])
            return message.reply({ content: "Thiếu người nhận", allowedMentions: { repliedUser: false } })
                .then(msg => client.deleteMsg(msg));
        //

        if(!args[1] || isNaN(args[1])) return message.reply({ content: "Nhập số hợp lệ", allowedMentions: { repliedUser: false } })
            .then(msg => client.deleteMsg(msg));
        
        addMoney(message.author.tag, user.user.id, toCheck);

        message.reply({ embeds:[{
            description:"**" + user.user.tag + "** đã được cộng thêm " + sodep(toCheck) + " " + client.emoji.dongxu,
            color: client.config.DEF_COLOR
        }], allowedMentions: { repliedUser: false } });
    }
}