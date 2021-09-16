const { Client, Message } = require("discord.js");

module.exports = {
    name: "say",
    description: "Cho bot nói thay bạn :D.",
    delay: 3,
    usage: "<PREFIX>say <nội dung>",
    ex: "<PREFIX>say Moon Cute",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(client, message, args) {
        if (!args.length) return message.channel.send({
            embeds: [{
                description: "Hãy nhập gì đó để nói và xoá.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        message.channel.send({ content: `**${message.member.nickname ? message.member.nickname : message.author.username}** ${args.join(" ")}` });
    }
}