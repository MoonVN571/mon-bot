const { calculate } = require('../../utils/utils');
const { Client, Message } = require('discord.js');
module.exports = {
    name: "uptime",
    aliases: ['ut'],
    description: "Xem thời gian hoạt động của bot.",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        var temp = parseInt(process.uptime());
        message.reply({
            embeds: [{
                description: "Bot đã hoạt động được **" + calculate(temp * 1000) + "**.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}