const { Client, Message, Permissions } = require("discord.js");
const Database = require('simplest.db');

module.exports = {
    name: "mute",
    description: "Chặn chat 1 nguòi dùng",
    usage: "<PREFIX>mute <tag/id> [lí do]",
    ex: "<PREFIX>mute MoonU",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
            // || message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
        ) return message.reply({
            embeds: [{
                title: "Thiếu quyền!",
                description: "Bạn không có quyền ``MANAGE_MESSAGES`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
        ) return message.reply({
            embeds: [{
                title: "Thiếu quyền!",
                description: "Bot không có quyền ``MANAGE_ROLES`` để mute người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
        ) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu quyền!",
                description: "Bot không có quyền ``MANAGE_CHANNELS`` để mute người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu thông tin!",
                description: "Bạn phải cung cấp người dùng cần mute.\n\nVí dụ: " + client.prefix + "kick <tag/id> [lí do]",
                footer: "Cú pháp <>: Bắt buộc; []: Không bắt buộc",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // find role, not found -> create the role name muted
        // set all channel role with no perm to chatting

        // Find and check role
        let findRole = message.guild.roles.cache.find(role => role.name == "Muted");
        if (!findRole) message.guild.roles.create({
            name: "Muted"
        });

        let getMuteRole = message.guild.roles.cache.find(role => role.name == "Muted");

        var userToMute = message.mentions.members.first() || args[0];
        if (userToMute) userToMute = userToMute.id;

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";
        const member = message.guild.members.cache.get(userToMute);

        if (member.user == client.user) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Lỗi!",
                description: "Mình không thể tự mute chính mính.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // add mute cho cac channel
        message.guild.channels.cache.forEach(channel => {
            // client.channels.cache.get(channel.id).pe
            channel.permissionOverwrites.create(getMuteRole, {
                SEND_MESSAGES: false,
            });
        });

        if (member.roles.cache.some(r => r.name == "Muted")) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Muted!",
                description: "Bạn đã cung cấp người dùng đã bị mute.",
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

        member.roles.add(getMuteRole, "MUTED, reason: " + reason).then(member => {
            message.reply({
                embeds: [{
                    title: client.emoji.success + "Thành công!",
                    description: "Bạn đã mute " + member.user.toString() + " với lí do: " + reason + ".",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            const dataLogger = new Database({ path: './data/guilds/' + message.guild.id + ".json" });

            // add user to data
            dataLogger.array.push("Muted", member.user.id);

            // check data
            let logChannel = dataLogger.get('moderation-channel');
            if (!logChannel) return;

            // check channel
            let channel = client.channels.cache.get(logChannel);
            if (!channel) return;

            channel.send({
                embeds: [{
                    title: "Moderation - Mute",
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
                            name: "Lí do mute",
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