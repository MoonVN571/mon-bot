const { Client, Message, Permissions } = require("discord.js");
const Database = require("simplest.db");

module.exports = {
    name: "unmute",
    description: "Bỏ mute người dùng",
    aliases: ['um'],
    delay: 3,
    usage: "<PREFIX>unmute <tag/id> [lí do]",
    ex: "<PREFIX>unmute <@837522183647264808> Vì mình thích",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
        ) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền!",
                description: "Bạn không có quyền ``MANAGE_MESSAGES`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
        ) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền!",
                description: "Bot không có quyền ``MANAGE_ROLES`` để bỏ Mute người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });


        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu thông tin!",
                description: "Bạn phải cung cấp người dùng cần mute*.\n\nVí dụ: " + client.prefix + "unmute <tag/id> [lí do]",
                footer: "Cú pháp <>: Bắt buộc; []: Không bắt buộc",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        let getMuteRole = message.guild.roles.cache.find(role => role.name == "Muted");

        var userToMute = message.mentions.members.first() || args[0];
        if (userToMute) userToMute = userToMute.id;

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";
        const member = message.guild.members.cache.get(userToMute);

        if (!member.roles.cache.some(r => r.name == "Muted")) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Lỗi!",
                description: "Bạn đã cung cấp người dùng chưa bị mute.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // check position role
        if (message.guild.me.roles.highest.position < getMuteRole.position) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Không đủ quyền!",
                description: "Role ``Muted`` phải ở dưới role cao nhất của bot.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // remove role member to user
        member.roles.remove(getMuteRole, "UN-MUTED, reason: " + reason).then(member => {
            message.reply({
                embeds: [{
                    title: client.emoji.success + "Thành công!",
                    description: "Bạn đã bỏ mute " + member.user.toString() + " với lí do: " + reason + ".",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
            
            const dataLogger = new Database({ path: './data/guilds/' + message.guild.id + ".json" });

            // remove user from data
            dataLogger.array.extract("Muted", member.user.id);

            // check data
            let logChannel = dataLogger.get('moderation-channel');
            if (!logChannel) return;

            // check channel
            let channel = client.channels.cache.get(logChannel);
            if (!channel) return;

            channel.send({
                embeds: [{
                    title: "Moderation - Unmute",
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
                            name: "Lí do un-mute",
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
        }).catch(err => {
            console.log(err);
            message.reply({
                embeds: [{
                    title: "Lỗi!",
                    description: "Bot đã xảy ra lỗi, thử lại sau!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        });
    }
}