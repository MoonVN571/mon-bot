const Database = require('simplest.db');

module.exports = {
    name: "warnings",
    description: "Xem số lần đã bị cảnh cáo.",
    delay: 3,

    async execute(client, message, args, serverData) {
        const userData = new Database({ path: './data/warnings/' + message.guild.id + ".json" });

        let count = userData.get(message.author.id) || 0;

        message.reply({
            embeds: [{
                description: "Bạn có " + count + " cảnh cáo!",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}