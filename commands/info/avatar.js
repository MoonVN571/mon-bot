module.exports = {
    name: "avatar",
    aliases: ["avt", "av"],
    description: "Xem avatar của ai đó.",
    usage: '<PREFIX>av [username/tag/id]',
    ex: '<PREFIX>av MoonU',
    delay: 3,

    async execute(client, message, args) {
        var user = args[0] || message.author.id;
        var tag = message.mentions.members.first();

        if (isNaN(user) && !tag) user = message.author.id;
        if (tag) user = tag.id;

        let check_name = client.users.cache.find(user => user.username.toLowerCase() == args.join(" ").toLowerCase());
        if (check_name) user = check_name.id;

        if (!check_name && !tag && isNaN(user) || !tag && isNaN(user)) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp ID hoặc tag người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        client.users.fetch(user).then(async user => {
            if (!user) return message.reply({
                embeds: [{
                    description: 'Hãy cung cấp người dụng hợp lệ!',
                    color: client.config.ERR_COLOR,
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

            if (!user.avatarURL) return message.reply({
                embeds: [{
                    description: "Không tìm thấy avatar của người này.",
                    color: client.config.ERR_COLOR,
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

            message.reply({
                embeds: [{
                    title: "Avatar của " + user.username + '\'s',
                    image: {
                        url: user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                    },
                    color: client.config.DEF_COLOR,
                    footer: {
                        text: "Yêu cầu bởi " + message.author.tag
                    },
                    timestamp: new Date()
                }], allowedMentions: { repliedUser: false }
            });
        }).catch(err => {
            if(err.message == "Unknown User") return trys(message.author.id);
            client.sendError(message.errorInfo, err);
            message.botError();
        });
    }
}