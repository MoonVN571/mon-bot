const { layNgauNhien } = require('../../utils/utils');

module.exports = {
    name: "pick",
    description: "Lựa chọn 1 trong những thứ bạn đưa ra",

    execute(client, message, args) {
        if (!args.length) return message.reply({
            embeds: [{
                description: "Bạn phải nhập dữ liệu. \n"
                    + "Cách sử dụng: ``" + client.prefix + "pick có,không`` Bot sẽ random có hoặc không, có thể nhập nhiều giá trị.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let content = args.join(" ").split(",");

        if (!content || content.length <= 1) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp đủ dữ liệu để random.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        message.reply({
            embeds: [{
                description: "Kết quả của bạn là **" + layNgauNhien(content).trim() + "**",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}