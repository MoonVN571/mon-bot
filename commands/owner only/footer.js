const Database = require('simplest.db');

module.exports = {
    name: "footer",
    description: "Thông tin thêm ở lệnh help",
    dev: true,
    discordDev: true,

    execute(client, message, args) {
        if (!args[0]) return message.reply({
            embeds: [{
                description: "Cung cấp thông tin.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let data = new Database({ path: "./data/footer.json" });

        data.set("text", args.join(" "));

        message.reply({
            embeds: [{
                description: "Bạn đã đặt thông tin của lệnh thành: \n\n" + args.join(" "),
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}