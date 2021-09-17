const Database = require('simplest.db');
const { getUserId } = require('../../utils/user');
const { sodep } = require('../../utils/utils');

/**
 * Color hex default: 0FF1CE
 * COlor hex error: f10f0f
 */
module.exports = {
    name: 'balance',
    aliases: ['bal', 'cash', 'money'],
    description: "Xem số tiền của bạn.",
    usage: "<PREFIX>bal [username/tag/id]",
    ex: "<PREFIX>bal MoonU",

    async execute(client, message, args) {            
        let data = new Database({path: `./data/eco/${message.author.id}.json`});
        let money = data.get('money') || 0;

        message.reply({embeds: [{
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
            },
            description: "Bạn đang có tổng " + sodep(money) + " " + client.emoji.dongxu ,
            color: "0FF1CE"
        }], allowedMentions: { repliedUser: false }});
    }
}