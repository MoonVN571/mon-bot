const { Client, Message, Permissions } = require("discord.js");
const Database = require("simplest.db");

module.exports = {
    name: "ban",
    description: "Cấm một người dùng trong server",
    delay: 3,
    usage: "<PREFIX>ban <tag/id> [lí do]",
    ex: "<PREFIX>ban <@837522183647264808> Không thích",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền!",
                decsription: "Bạn không có quyền để sử dụng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply([{
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền!",
                description: "Bot không đủ quyền để cấm người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }]);


        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu thông tin!",
                description: "Bạn phải cung cấp người dùng cần cấm.\n\n Ví dụ: " + client.prefix + "ban <user/id> [lí do]",
                footer: "Cú pháp <>: Bắt buộc; []: Không bắt buộc",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";

        var userToBan = message.mentions.members.first() || args[0];
        if (userToBan) userToBan = userToBan.id;

        if (userToBan == message.author.id) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Tự huỷ!",
                description: "Bạn không thể cấm chính mình.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (userToBan == client.user.id) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Tự huỷ?",
                description: "Mình không thể ban chính mính.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });
        
        let member = await message.guild.members.cache.get(userToBan);

        if (!member) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Sai thông tin!",
                description: "Bạn phải cung cấp người dùng trong server này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!member.bannable) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền!",
                description: "Bot không đủ quyền để cấm người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // punish
        try {
            member.ban({ days: 7, reason: reason }).then(user_banned => {
                message.reply({
                    embeds: [{
                        title: client.emoji.success + "Thành công!",
                        description: "**" + member.user.tag + "** đã bị cấm với lí do: *" + reason + "*.",
                        color: client.config.DEF_COLOR
                    }], allowedMentions: { repliedUser: false }
                });
                
                const dataLogger = new Database({ path: './data/guilds/' + message.guild.id + ".json" });

                // check data
                let logChannel = dataLogger.get('moderation-channel');
                if (!logChannel) return;

                // check channel
                let channel = client.channels.cache.get(logChannel);
                if (!channel) return;

                channel.send({
                    embeds: [{
                        title: "Moderation - Ban",
                        fields: [
                            {
                                name: "Người thực hiện",
                                value: message.author.toString(),
                                inline: true
                            }, {
                                name: "Người áp dụng",
                                value: member.user.toString(),
                                inline: true
                            }, {
                                name: "Lí do cấm",
                                value: reason,
                                inline: false
                            },
                        ],
                        thumbnail: { url: member.user.avatarURL() },
                        timestamp: new Date(),
                        color: client.config.DEF_COLOR,
                        footer: { text: member.user.id }
                    }]
                });
            });
        } catch (e) {
            console.log(e);
            return message.reply({
                embeds: [{
                    title: "ERROR",
                    description: "Bot đã sảy ra lỗi!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }
    }
}