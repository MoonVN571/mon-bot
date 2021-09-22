const { Client, CommandInteraction, Permissions } = require("discord.js");
const Database = require('simplest.db');
module.exports = {
    name: 'mute',
    description: "Mute 1 người dùng",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            type: "USER",
            description: "Cung cấp người cần mute",
            required: true
        },
        {
            name: "reason",
            type: "STRING",
            description: "Lí do mute",
            required: false
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
     execute: async (client, interaction, args) => {
        let user = interaction.options.getMember("user");
        let reason = interaction.options.getString("reason") || "Không có";

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
        return interaction.followUp({
            embeds: [{
                description: "Bạn không có quyền quản lí tin nhắn để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
        ) return interaction.followUp({
            embeds: [{
                description: "Bot không có quyền ``Quản lí Kênh`` để mute người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // Find and check role
        let findRole = interaction.guild.roles.cache.find(role => role.name == "Muted");
        if (!findRole) await interaction.guild.roles.create({
            name: "Muted"
        });

        let getMuteRole = interaction.guild.roles.cache.find(role => role.name == "Muted");

        const member = await interaction.guild.members.fetch(user);

        if (member.user == client.user) return interaction.followUp({
            embeds: [{
                description: "Mình không thể mute chính mính.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // first time
        const dataSet =  new Database({path: './data/guilds/' + interaction.guildId + ".json"});
        if(!dataSet.get('firstMute')) {
            dataSet.set('firstMute', true);
            // add mute cho cac channel
            interaction.guild.channels.cache.forEach(channel => {
                // client.channels.cache.get(channel.id).pe
                channel.permissionOverwrites.create(getMuteRole, {
                    SEND_MESSAGES: false,
                }).catch(err => {
                    client.sendError(errorInfo + "Set role can not send message while muted: ```" + err + "```");
                });
            });
        }

        if (member.roles.cache.some(r => r.name == "Muted")) return interaction.followUp({
            embeds: [{
                description: "Người đã bị mute từ trước.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        // check position role
        if (interaction.guild.me.roles.highest.position < getMuteRole.position) return interaction.followUp({
            embeds: [{
                description: "Role ``Muted`` phải ở dưới role cao nhất của bot.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        member.roles.add(getMuteRole, "MUTED, reason: " + reason).then(async member => {
            await member.send({embeds: [{
                title: "MUTED",
                description: "Bạn đã bị mute tại server **" + interaction.guild.name + "**, lí do: *" + reason + "*.",
                timestamp: new Date(),
                color: client.config.DEF_COLOR
            }]}).catch(()=> {});
    
            interaction.followUp({
                embeds: [{
                    description: "Bạn đã mute " + member.user.toString() + " với lí do: " + reason + ".",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            const dataLogger = new Database({ path: './data/guilds/' + interaction.guild.id + ".json" });

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
                            value: interaction.member.user.toString(),
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
            });
        }).catch(err => {
            client.sendError(interaction.errorInfo, err);
            interaction.botError();
        });

    }
}