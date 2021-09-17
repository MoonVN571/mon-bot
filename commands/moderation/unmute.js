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
                description: "Bạn không có quyền ``Quản lí Tin nhắn`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
        ) return message.reply({
            embeds: [{
                description: "Bot không có quyền ``Quản l1i Role`` để bỏ Mute người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));


        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng cần mute.\nCách sử dụng: " + client.prefix + "unmute <tag/id> [lí do]",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let getMuteRole = message.guild.roles.cache.find(role => role.name == "Muted");

        var userToMute = message.mentions.members.first() || args[0];
        if (userToMute) userToMute = userToMute.id;

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";
        const member = message.guild.members.cache.get(userToMute);

        if (!member.roles.cache.some(r => r.name == "Muted")) return message.reply({
            embeds: [{
                description: "Bạn đã cung cấp người dùng chưa bị mute.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // check position role
        if (message.guild.me.roles.highest.position < getMuteRole.position) return message.reply({
            embeds: [{
                description: "Role ``Muted`` phải ở dưới role cao nhất của bot.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // remove role member to user
        member.roles.remove(getMuteRole, "UN-MUTED, reason: " + reason).then(member => {
            message.reply({
                embeds: [{
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
                    title: "Moderation - Bỏ Mute",
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
                            name: "Lí do Bỏ Mute",
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
                    description: "Bot đã xảy ra lỗi thử lại sau!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        });
    }
}