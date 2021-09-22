const { Client, Message } = require('discord.js');
const ms = require('ms');
const { calculate } = require('../../utils/utils');
module.exports = {
    name: "addpremium",
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
        if(isNaN(args[0]))
            return message.reply({content: "Cung cấp ID server / ID user"})
                .then(msg => client.msgDelete(msg));

        if(!ms(args[0]))
        return message.reply({content: "Cung cấp thời gian hợp lệ!"})
            .then(msg => client.msgDelete(msg));
            
        client.users.fetch(args[0]).then(async user => {
            if(checkGuild(args[0])) return;

            message.reply({ embeds:[{
                description:"**" + user.tag + "** đã được cộng premium user trong ``" + calculate(ms(args[0])) + "``.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false } });

            user.send({embeds: [{
                title: "Premium Package",
                description: "Bạn đã được cộng premium user trong " + calculate(args[0]) + ".",
                color: client.config.DEF_COLOR
            }]});

        }).catch(err => {
            if(err.message == "Unknown User") return checkGuild();
        });

        function checkGuild() {
            let guild = client.guilds.cache.get(args[0]);

            if(!guild) return message.reply({content: "Server ID / user ID không hợp lệ!", allowedMentions: { repliedUser: false }})
                .then(msg => client.msgDelete(msg));

            //
            message.reply({ embeds:[{
                description: "Server **" + guild.name + "** đã được thêm premium trong ``" + calculate(ms(args[0])) + "``.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false } });
        }
    }
}