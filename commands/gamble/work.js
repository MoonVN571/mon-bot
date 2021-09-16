const Database = require('simplest.db');
const { random, sodep } = require('../../utils/utils');

module.exports = {
    name: "work",
    description: "Làm việc nhận tiền bot.",
    aliases: ['w'],
    delay: 300,

    execute(client, message, args) {        
        let data = new Database({path: `./data/eco/${message.author.id}.json`});

        var randomMsg = ['đứng đứng đường nhận', 'được lì xì', 'đi chơi gái và nhận được', 'làm việc chăm chỉ và nhận được', 'bạn đã cướp ngân hàng được'];

        const got = random(3000, 5000);
        const content = randomMsg[random(1, randomMsg.length)];

        data.number.add("money", got);

        message.reply({embeds: [{
            description: "Bạn vừa " + content + " " + sodep(got) + " " + client.emoji.dongxu,
            color: "0FF1CE",
        }], allowedMentions: { repliedUser: false }});
    }
}