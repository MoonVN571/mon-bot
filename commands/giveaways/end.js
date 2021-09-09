const { Client, Message } = require('discord.js');
const Database = require('simplest.db');
const config = require('../../config.json');
module.exports = {
    name: "end",

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
                    title: client.emojs.failed + "Thiếu quyền!",
                    description: "Bạn không sỡ hữu id giveaway này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        if (!args[0])
            return message.reply({
                embeds: [{
                    title: client.emojs.failed + "Thiếu thông tin!",
                    description: "Cung cấp Id tin nhắn của giveaway.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        if (isNaN(+args[0]) || args[0].length !== 18)
            return message.reply({
                embeds: [{
                    title: client.emojs.failed + "Sai ID!",
                    description: "Nhập đúng id tin nhắn để end.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

        // xoa data va tien hanh end ga
        client.giveawaysManager.end(args[0]).then(() => {
             
            return message.reply({
                embeds: [{
                    title: client.emoji.success + "Thành công!",
                    description: "Bạn đã kết thúc giveaway.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }).catch((err) => {
            if (err.toString().startsWith("No giveaway found with message Id"))
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Sai ID!",
                    description: "Không tìm thấy id giveaway này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            if (err.toString().includes("Giveaway with message Id"))
                 
            return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Sai ID!",
                    description: "Giveaway này đã kết thúc.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            // khong co loi tren se bao loi
            console.log(err);
            // not on reason
            message.reply({ content: "Đã sảy ra lỗi! Vui lòng thử lại sau." })
        });
    }
}