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
                description: "Bạn không có quyền quản lí tin nhắn để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
        ) return message.reply({
            embeds: [{
                description: "Bot không có quyền ``Quản lí Kênh`` để mute người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng cần mute.\nCách sử dụng: " + client.prefix + "kick <tag/id> [lí do]",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // find role, not found -> create the role name muted
        // set all channel role with no perm to chatting

        // Find and check role
        let findRole = message.guild.roles.cache.find(role => role.name == "Muted");
        if (!findRole) await message.guild.roles.create({
            name: "Muted"
        });

        let getMuteRole = message.guild.roles.cache.find(role => role.name == "Muted");

        let userToMute = message.mentions.members.first() || args[0];
        if (userToMute) userToMute = userToMute.id;

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";
        const member = message.guild.members.cache.get(userToMute);

        if (member.user == client.user) return message.reply({
            embeds: [{
                description: "Mình không thể mute chính mính.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        // first time
        const dataSet =  new Database({path: './data/guilds/' + message.guildId + ".json"});
        if(!dataSet.get('firstMute')) {
            dataSet.set('firstMute', true);
            // add mute cho cac channel
            message.guild.channels.cache.forEach(channel => {
                // client.channels.cache.get(channel.id).pe
                channel.permissionOverwrites.create(getMuteRole, {
                    SEND_MESSAGES: false,
                }).catch(err => {
                    client.sendError(errorInfo + "Set role can not send message while muted: ```" + err + "```");
                });
            });
        }

        if (member.roles.cache.some(r => r.name == "Muted")) return message.reply({
            embeds: [{
                description: "Người đã bị mute từ trước.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        // check position role
        if (message.guild.me.roles.highest.position < getMuteRole.position) return message.reply({
            embeds: [{
                description: "Role ``Muted`` phải ở dưới role cao nhất của bot.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        member.roles.add(getMuteRole, "MUTED, reason: " + reason).then(member => {
            message.reply({
                embeds: [{
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
            }).catch(err => {
                client.sendError(message.errorInfo + err);
            });
        }).catch(err => {
            client.sendError("Mute, add roles: ```"+ err + "```");
            message.botError();
        });

    }
}