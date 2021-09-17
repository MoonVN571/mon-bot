const { Client, Message } = require('discord.js');
const { apartMoney, setMoney } = require('../../utils/eco');
const { sodep } = require('../../utils/utils');
module.exports = {
    name: "removemoney",
    description: "Thêm tiền cho ai đó",
    usage: "<PREFIX>removemoney <User/ID> <Số tiền>",
    ex: "<PREFIX>rm @MoonU 100000",
    dev: true,
    aliases: ['rm'],

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        let userId = getUserId(client,message,args,false);

        trys(userId);
        function trys(userId) {
            client.users.fetch(userId).then(async user => {
                if(!args[1] || isNaN(args[1])) return message.reply({ content: "Nhập số hợp lệ", allowedMentions: { repliedUser: false } })
                    .then(msg => client.deleteMsg(msg));
                
                setMoney(message.author.tag, user.user.id, toCheck);

                message.reply({ embeds:[{
                    description:"Tiền của **" + user.user.tag + "** đã được đặt thành " + sodep(toCheck) + " " + client.emoji.dongxu,
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false } });
            }).catch(err => {
                if(err.message == "Unknown User") return message.reply({contnet: "Người nhận không hợp lệ", allowedMentions: { repliedUser: false} });
                message.botError();
            });
        }
    }
}