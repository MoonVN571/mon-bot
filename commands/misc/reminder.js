const ms = require('ms');

module.exports = {
    name: "reminder",
    description: "Nhắc nhở cho bạn.",
    aliases: ['remind'],
    usage: "<PREFIX>reminder <1h,30m,15s> <Lời nhắc>",
    ex: "<PREFIX>reminder 1h Đi học",
    delay: 5,

    execute(client, message, args) {
        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập thời gian, theo tiếng anh (d, h, m, s).\n\n"
                    + "Cách sử dụng: " + client.prefix + "reminder <Thời gian> <Lời nhắc>",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let checkTime = ['h', 'm', 's'];

        if (!args[0].split("").indexOf(checkTime) || !ms(args[0])) return message.reply({
            embeds: [{
                description: "Bạn phải nhập định dạng giờ hỗ trợ. (1h, 30m, 15s)",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let content = message.content.split(args[0] + " ")[1] || "hãy làm gì đó vào " + args[0] + " sau";

        message.reply({
            embeds: [{
                description: "Đã nhập lời nhắc của bạn vào " + args[0] + " sau là *" + content + "*.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        setTimeout(() => {
            message.author.send({
                content: "Này " + message.author.toString() + ", ", embeds: [{
                    title: "Reminder",
                    description: "Lời nhắc của bạn vào ``" + args[0] + "`` sau là *" + content + ".*",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }, ms(args[0]));
    }
}