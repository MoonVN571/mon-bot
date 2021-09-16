const { Message, Client, Permissions } = require("discord.js");
const Database = require('simplest.db');

module.exports = {
    name: "unban",
    description: "bỏ cấm một người dùng bằng ID",
    delay: 3,
    usage: "<PREFIX>unban <ID> [Lí do]",
    ex: "<PREFIX>unban 000000000000000000",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply({
            embeds: [{
                decsription: "Bạn không có quyền để sử dụng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply([{
            embeds: [{
                description: "Bot không đủ quyền ``Cấm Member`` để bỏ cấm người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }]);

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng cần cấm.\nCách sử dụng: " + client.prefix + "unban <tag/id> [lí do]",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";

        var userToUnban = args[0];

        var er = false;

        message.guild.members.unban(userToUnban).catch(error => {
            er = true;
            if (error.toString().includes("Couldn't resolve the user id to unban.")) return message.reply({
                embeds: [{
                    description: "Bạn phải nhập ID người dùng hợp lệ",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
            if (error.toString().includes("Unknown Ban")) return message.reply({
                embeds: [{
                    title: client.emoji.failed + " Chưa bị cấm!",
                    description: "Không tìm thấy danh sách cấm của người này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
            console.log(error);
        });

        if (er) return;

        client.users.fetch(userToUnban).then(user => {
            message.reply({
                embeds: [{
                    description: "**" + user.tag + "** đã được thu hồi lệnh cấm với lí do: *" + reason + "*.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            const dataLogger = new Database({ path: './data/guilds/' + message.guild.id + '.json' });

            // check data
            let logChannel = dataLogger.get('moderation-channel');
            if (!logChannel) return;

            // check channel
            let channel = client.channels.cache.get(logChannel);
            if (!channel) return;

            channel.send({
                embeds: [{
                    title: "Moderation - Unban",
                    fields: [
                        {
                            name: "Người thực hiện",
                            value: message.author.toString(),
                            inline: true
                        }, {
                            name: "Người áp dụng",
                            value: user.tag,
                            inline: true
                        }, {
                            name: "Lí do bỏ cấm",
                            value: reason,
                            inline: false
                        },
                    ],
                    thumbnail: { url: member.user.avatarURL() },
                    timestamp: new Date(),
                    footer: { text: member.user.id },
                    color: client.config.DEF_COLOR
                }]
            });
        });
    }
}