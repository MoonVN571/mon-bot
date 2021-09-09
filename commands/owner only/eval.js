const { Client, Message } = require('discord.js');

module.exports = {
    name: "eval",
    aliases: ['e'],
    dev: true,
    discordDev: true,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    async execute(client, message, args) {
        if(!args.length) return message.channel.send("Nhập code");

        try {
            await eval(args.join(' '));
            message.channel.send(client.emoji.success + "Code chạy thành công!");
        } catch (err) {
            message.channel.send(`<:1024_TickNo_Night:883667478813736960> | Lỗi: ${err.toString()}`);
        }
    }
}