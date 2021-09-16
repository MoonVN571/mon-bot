const { getUserId } = require('../../utils/user');

module.exports = {
    name: "avatar",
    aliases: ["avt", "av"],
    description: "Xem avatar của ai đó.",
    usage: '<PREFIX>av [username/tag/id]',
    ex: '<PREFIX>av MoonU',
    delay: 3,

    async execute(client, message, args) {
        let userId = getUserId(client,message,args,true);

        trys(userId);
        function trys(userId) {
            client.users.fetch(userId).then(user => {
                if (!user) return message.reply({
                    embeds: [{
                        description: `Bạn cung cấp người dùng không hợp lệ.`,
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
                client.sendError(err);
                message.commandError();
            })
        }
    }
}