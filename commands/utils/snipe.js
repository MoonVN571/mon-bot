const Database = require('simplest.db');
const { trimText } = require('../../utils/utils');
module.exports = {
    name: "snipe",
    description: "Xem tin nhắn đã bị xoá gần nhất trong kênh.",
    delay: 5,

    async execute(client, message, args) {
        let db = new Database({ path: './data/snipe.json' });
        let sniper = db.get(message.channelId);

        if (!sniper) return message.reply({
            embeds: [{
                description: "Không tìm thấy tin nhắn đã xoá nào.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let user = await client.users.fetch(sniper.author);

        let content = sniper.content;
        let betterContent = trimText(content ? content : "Không có nội dung", 950, "\nCòn lại {COUNT} từ.");
        message.reply({
            embeds: [{
                author: {
                    name: user.tag,
                    icon_url: user.avatarURL()
                },
                description: betterContent,
                image: { url: sniper.image },
                color: client.config.DEF_COLOR,
                timestamp: new Date()
            }], allowedMentions: { repliedUser: false }
        }).catch((e) => {
            client.sendError(message.errorInfo, e);
            message.botError();
        });
    }
}