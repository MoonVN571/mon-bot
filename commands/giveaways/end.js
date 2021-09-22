const { Client, Message } = require('discord.js');
const Database = require('simplest.db');
module.exports = {
    name: "end",
    description: "Kết thúc giveaway",
    ex: "<PREFIX>end <EXAMPLE_ID>",
    usage: "<PREFIX>end <ID GA>",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        // if (!config.admin.indexOf(message.author.id) < 0) return;
        // check author GA
        const dataAuthor = new Database({ path: "./data/giveaway/author.json" });

        if (dataAuthor.get(args[0]) != message.author.id)
            return message.reply({
                embeds: [{
                    description: "Bạn không sỡ hữu id giveaway này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        if (!args[0])
            return message.reply({
                embeds: [{
                    description: "Cung cấp Id tin nhắn của giveaway.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        if (isNaN(+args[0]) || args[0].length !== 18)
            return message.reply({
                embeds: [{
                    description: "Nhập đúng id tin nhắn để end.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        // xoa data va tien hanh end ga
        client.giveawaysManager.end(args[0]).then(() => {
             
            return message.reply({
                embeds: [{
                    description: "Bạn đã kết thúc giveaway này thành công!",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }).catch((err) => {
            if (err.toString().startsWith("No giveaway found with message Id"))
            return message.reply({
                embeds: [{
                    description: "Không tìm thấy id tin nhắn giveaway này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            if (err.toString().includes("Giveaway with message Id"))
            return message.reply({
                embeds: [{
                    description: "Giveaway này đã kết thúc!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            client.sendError(message.errorInfo + err);
            message.botError();
        });
    }
}