const Database = require('simplest.db');
const { random } = require('../../utils/utils');

module.exports = {
    name: "daily",
    description: "Nhận quà mỗi ngày.",
    delay: 43200,

    execute(client, message, args) {
        message.reply({
            embeds: [{
                description: "Bạn có thể vote bot ngay bây giờ! Vote [tại đây](https://monbot.tk/vote)",
                color: "0FF1CE"
            }], allowedMentions: { repliedUser: false }
        });
    }
}