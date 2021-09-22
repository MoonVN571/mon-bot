const { Client, CommandInteraction, Permissions } = require("discord.js");
const Database = require("simplest.db");

module.exports = {
    name: "unmute",
    description: "Bỏ mute người dùng",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            type: "USER",
            description: "Nhập người cần unmute",
            required: true
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    async execute(client, interaction, args) {
        let userToMute = interaction.options.getMember("user");

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
        ) return interaction.followUp({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Tin nhắn`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
        ) return interaction.followUp({
            embeds: [{
                description: "Bot không có quyền ``Quản lí Role`` để bỏ Mute người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let getMuteRole = interaction.guild.roles.cache.find(role => role.name == "Muted");

        const member = await interaction.guild.members.fetch(userToMute);

        if (!member.roles.cache.some(r => r.name == "Muted")) return interaction.followUp({
            embeds: [{
                description: "Bạn đã cung cấp người dùng chưa bị mute.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // check position role
        if (interaction.guild.me.roles.highest.position < getMuteRole.position) return interaction.followUp({
            embeds: [{
                description: "Role ``Muted`` phải ở dưới role cao nhất của bot.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // remove role member to user
        member.roles.remove(getMuteRole, "UN-MUTED, Un muted by " + interaction.member.user.tag).then(async member => {
            await member.send({embeds: [{
                title: "UN-MUTED",
                description: "Bạn đã được bỏ mute tại server **" + interaction.guild.name + "**.",
                timestamp: new Date(),
                color: client.config.DEF_COLOR
            }]}).catch(()=> {});

            interaction.followUp({
                embeds: [{
                    description: "Bạn đã bỏ mute " + member.user.toString() + ".",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
            
            const dataLogger = new Database({ path: './data/guilds/' + interaction.guild.id + ".json" });

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
                            value: interaction.author.toString(),
                            inline: true
                        }, {
                            name: "Người áp dụng",
                            value: member.user.toString(),
                            inline: true
                        }
                    ],
                    thumbnail: { url: member.user.avatarURL() },
                    timestamp: new Date(),
                    color: client.config.DEF_COLOR,
                    footer: { text: member.user.id }
                }]
            }).catch(err => {
                client.sendError(interaction.errorInfo, err);
            });
        }).catch(err => {
            client.sendError(interaction.errorInfo, err);
        });
    }
}