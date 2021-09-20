const Database = require('simplest.db');

module.exports = {
    name: "afk",
    description: "Đặt trạng thái của bạng là đang AFK.",
    delay: 5,
    usage: "<PREFIX>afk <lời nhắn",
    ex: "<PREFIX>afk treo máy đi ngủ",

    execute(client, message, args) {
        let data = new Database({ path: './data/afk.json' });

        let checkAfk = data.get(message.guild.id + "." + message.author.id);

        if (checkAfk && (args.length || !args.join(" "))) {
            data.delete(message.guild.id + "." + message.author.id);
            message.reply({
                embeds: [{
                    description: "Bạn đã tắt chế độ afk thành công.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
            return;
        }

        let msg = args.join(" ") || "Không có";

        data.set(message.guild.id + "." + message.author.id + ".afking", true);
        data.set(message.guild.id + "." + message.author.id + ".loinhan", msg);
        data.set(message.guild.id + "." + message.author.id + ".thoigian", Date.now());

        message.reply({
            embeds: [{
                description: "Bạn đã đặt trạng thái là AFK.\nLời nhắn của bạn: " + msg,
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}