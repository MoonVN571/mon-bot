const { Client, Message, Permissions } = require("discord.js");
const Database = require("simplest.db");
const { sleep } = require("../../utils/utils");

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
                decsription: "Bạn không có quyền để sử dụng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply([{
            embeds: [{
                description: "Bot không đủ quyền để cấm người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }]).then(msg => client.msgDelete(msg));

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng cần cấm.\nCách sử dụng: " + client.prefix + "ban <tag/id> [lí do]",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        const reason = args.join(" ").split(args[0] + " ")[1] || "Không có";

        var userToBan = message.mentions.members.first() || args[0];
        if (userToBan) userToBan = userToBan.id;

        if (userToBan == message.author.id) return message.reply({
            embeds: [{
                description: "Bạn không thể cấm chính mình.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (userToBan == client.user.id) return message.reply({
            embeds: [{
                description: "Mình không thể ban chính mính.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));
        
        let member = await message.guild.members.cache.get(userToBan);

        if (!member) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng trong server này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!member.bannable) return message.reply({
            embeds: [{
                description: "Bot không đủ quyền để cấm người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // punish
        await member.send({embeds: [{
            title: "BANNED",
            description: "Bạn đã bị cấm khỏi server **" + message.guild.name + "**, lí do: *" + reason + "*.",
            timestamp: new Date(),
            color: client.config.DEF_COLOR
        }]}).catch(()=> {});

        await sleep(2000);
        
        await member.ban({ days: 7, reason: reason }).then(() => {
            message.reply({
                embeds: [{
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
            }).catch(err => {
                client.sendError(message.errorInfo, err);
            });
        }).catch(err => {
            client.sendError(message.errorInfo, err);
            message.botError();
        });
    }
}