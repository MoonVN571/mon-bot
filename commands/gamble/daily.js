const Database = require('simplest.db');
const { random } = require('../../utils/utils');

module.exports = {
    name: "daily",
    description: "Nhận quà mỗi ngày.",
    delay: 86400,

    execute(client, message, args) {
        let free_money = random(10000, 20000);
        let data = new Database({ path: './data/eco/' + message.author.id + ".json" });

        data.number.add("money", free_money);

        message.reply({
            embeds: [{
                description: "Bạn đã nhận được " + Intl.NumberFormat().format(free_money) + client.emoji.dongxu + ". Hãy nhận lại tiếp vào hôm sau nhé!",
                color: "0FF1CE"
            }], allowedMentions: { repliedUser: false }
        });
    }
}