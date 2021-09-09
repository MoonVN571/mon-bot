const { layNgauNhien } = require('../../utils/utils');

module.exports = {
    name: "pick",
    description: "Lựa chọn 1 trong những thứ bạn đưa ra",

    execute(client, message, args) {
        if (!args.length) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu thông tin!",
                description: "Bạn phải nhập dữ liệu. \n\n"
                    + "Ví dụ: ``" + client.prefix + "pick có,không`` Bot sẽ random có hoặc không, có thể nhập nhiều giá trị.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let content = args.join(" ").split(",");

        if (!content || content.length <= 1) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Không đủ thông tin!",
                description: "Bạn phải cung cấp đủ dữ liệu để random. \n\n"
                    + "Ví dụ: ``" + client.prefix + "pick có,không`` Bot sẽ random có hoặc không, có thể nhập nhiều giá trị.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        message.reply({
            embeds: [{
                title: client.emoji.success + "Đã random",
                description: "Kết quả của bạn là **" + layNgauNhien(content) + "**",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}