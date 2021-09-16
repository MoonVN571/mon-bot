const Database = require('simplest.db');

module.exports = {
    name: "snipe",
    description: "Xem tin nhắn đã bị xoá gần nhất trong kênh.",
    delay: 5,

    async execute(client, message, args) {
        let db = new Database({ path: './data/snipe.json' });

        var sniper = db.get(message.channel.id);

        if (!sniper) return message.reply({
            embeds: [{
                description: "Không tìm thấy tin nhắn đã xoá nào.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        try {
            message.reply({
                embeds: [{
                    title: sniper.author,
                    description: sniper.content,
                    image: { url: sniper.image },
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        } catch (e) {
            client.sendError(e);
            message.botError();
        }
    }
}