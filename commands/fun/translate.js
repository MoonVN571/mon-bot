const translatte = require('@vitalets/google-translate-api');

module.exports = {
    name: "translate",
    aliases: ["trans"],
    description: "Dịch.",
    usage: "<PREFIX>trans <Ngôn ngữ> <Từ cần dịch>",
    ex: "<PREFIX>trans vi smart",

    execute(client, message, args) {
        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin!",
                description: "Bạn phải nhập ngôn ngữ gốc.\n\nCú pháp: " + client.config.PREFIX + "trans<ngôn ngữ cần dịch> <nội dung>",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let content = message.content.split(args[0])[1];

        if (content.length > 50) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Quá nhiều kí tự",
                description: "Độ dài ký tự quá lớn.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        translatte(content, { to: args[0] }).then(res => {
            message.reply({
                embeds: [{
                    author: {
                        name: "Google translate",
                        icon_url: "https://upload.wikimedia.org/wikipedia/commons/d/db/Google_Translate_Icon.png"
                    },
                    description: res.text + "",
                    timestamp: new Date(),
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }).catch(e => {
            if (e.toString().includes("The language") && e.toString().includes("is not supported")) return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Sai ngôn ngữ",
                    description: "Ngôn ngữ không hợp lệ.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
            message.botError();
            console.log(e);
        });

    }
}