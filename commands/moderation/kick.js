const { Client, Message, Permissions } = require("discord.js");
const Database = require('simplest.db');

module.exports = {
    name: 'kick',
    description: "Đá một người dùng khỏi server",
    delay: 3,
    usage: "<PREFIX>kick <tag/id> [lí do]",
    ex: "<PREFIX>kick <@837522183647264808> Bot account",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply({
            embeds: [{
                decsription: "Bạn không có quyền để sử dụng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!message.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply([{
            embeds: [{
                description: "Bot không đủ quyền để cấm người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }]).then(msg => client.msgDelete(msg));

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng cần kick.\nCách sử dụng: " + client.prefix + "kick <tag/id> [lí do]",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";

        var userToKick = message.mentions.members.first() || args[0];
        if (userToKick) userToKick = userToKick.id;

        let member = await message.guild.members.cache.get(userToKick);

        if (userToKick == message.author.id) return message.reply({
            embeds: [{
                description: "Bạn không thể kick chính mình.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (member.user == client.user) return message.reply({
            embeds: [{
                description: "Mình không thể đá chính mính.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!member) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng trong server này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!member.kickable) return message.reply({
            embeds: [{
                description: "Bot không đủ quyền để kick người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // punish
        await member.send({embeds: [{
            title: "KICKED",
            description: "Bạn đã bị kick khỏi server **" + message.guild.name + "**, lí do: *" + reason + "*.",
            timestamp: new Date(),
            color: client.config.DEF_COLOR
        }]}).catch(()=> {});

        await member.kick(reason).then(() => {
            message.reply({
                embeds: [{
                    description: "**" + member.user.tag + "** đã bị kick với lí do: *" + reason + "*.",
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
                    title: "Moderation - Kick",
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
                            name: "Lí do kick",
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
            message.botError();
            client.sendError(message.errorInfo + err);
        });
    }
}