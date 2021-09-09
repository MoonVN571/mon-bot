const { Client, Message } = require("discord.js");

module.exports = {
    name: "say",
    description: "Cho bot nói thay bạn :D.",
    delay: 3,
    usage: "<PREFIX>say <nội dung>",
    ex: "<PREFIX>say Moon uwu",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(client, message, args) {
        if (!args.length) return message.channel.send({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin!",
                description: "Hãy nhập gì đó để nói.",
                color: client.config.ERR_COLOR
            }]
        });

        message.channel.send({ content: `**${message.member.nickname ? message.member.user : message.author.username}** ${args.join(" ")}` });
    }
}