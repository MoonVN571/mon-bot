const { Client, Message } = require('discord.js');
module.exports = {
    name: "removepremium",
    description: "Thêm premium server",
    usage: "<PREFIX>addpremium <User/Sv ID>",
    ex: "<PREFIX>addpremium <EXAMPLE_ID>",
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
        var user = args[0];
        var tag = message.mentions.members.first();

        if (tag) user = tag.user.id;

        let check_name = client.users.cache.find(user => user.username.toLowerCase() == args.join(" ").toLowerCase());
        if (check_name) user = check_name.id;

        if (!check_name && !tag && isNaN(user) || !tag && isNaN(user)) return message.reply({
            content: "Nhập người nhận hợp lệ", allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        client.users.fetch(user).then(async user => {
            if(!args[1] || isNaN(args[1])) return message.reply({ content: "Nhập số hợp lệ", allowedMentions: { repliedUser: false } })
                .then(msg => client.deleteMsg(msg));
            
            addMoney(message.author.tag, user.id, +args[1]);

            message.reply({ embeds:[{
                description:"**" + user.tag + "** đã được cộng thêm " + sodep(+args[1]) + " " + client.emoji.dongxu,
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false } });
        }).catch(err => {
            if(err.message == "Unknown User") return message.reply({contnet: "Người nhận không hợp lệ", allowedMentions: { repliedUser: false} });
            message.botError();
            client.sendError(message.errorInfo, e);
        });
    }
}