const Database = require('simplest.db');

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
        var user = args[0] || message.author.id;

        var tag = message.mentions.members.first();
                 
        if(isNaN(user) && !tag) user = message.author.id; 
        if(tag) user = tag.id;

        let check_name = await client.users.cache.find(user => user.username.toLowerCase() == args.join(" ").toLowerCase());
        if(check_name) user = check_name.id;
        
        if(!check_name && !tag && isNaN(user)) return message.reprly({embeds: [{
            description: "Bạn phải cung cấp ID hoặc tag người dùng.",
            color: client.config.ERR_COLOR
        }], allowedMentions: { repliedUser: false } });

        if(!tag && isNaN(user)) user = message.author.id;

        client.users.fetch(user).then(user => {
            let data = new Database({path: `./data/eco/${user.id}.json`});
            let money = data.get('money') || 0;

            message.reply({embeds: [{
                author: {
                    name: user.username,
                    icon_url: user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                },
                description: "Bạn đang có " + Intl.NumberFormat().format(money) + " <:1824_coin:883648611592855553>" ,
                color: "0FF1CE"
            }], allowedMentions: { repliedUser: false }});
        });
    }
}