const { Client, CommandInteraction, Permissions } = require("discord.js");
const Database = require('simplest.db');
module.exports = {
    name: 'warn',
    description: "Cảnh cáo user",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            type: "USER",
            description: "Cung cấp người cần cần cánh cáo",
            required: true
        },
        {
            name: "reason",
            type: "STRING",
            description: "Lí do cảnh cáo",
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

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
        ) return await interaction.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        const member = await interaction.guild.members.fetch(user);

        if (member.user.bot) return await interaction.reply({
            embeds: [{
                description: "Bạn không thể cảnh cáo bot.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (member.user == interaction.member.user) return await interaction.reply({
            embeds: [{
                description: "Bạn không thể cảnh cáo chính mình.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!member) return await interaction.reply({
            embeds: [{
                description: "Không tìm thấy người này trong server.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        // lay guild id
        const dataWarn = new Database({ path: "./data/warnings/" + interaction.guild.id + ".json" });
        let userWarns = dataWarn.get(member.user.id) || "đầu";

        if(!dataWarn.get(member.user.id)) dataWarn.number.add(member.user.id, 1);

        dataWarn.number.add(member.user.id, 1);

        await member.send({embeds: [{
            title: "WARNED",
            description: "Bạn đã bị cảnh cáo tại server **" + interaction.guild.name + "**, lí do: *" + reason + "*.",
            timestamp: new Date(),
            color: client.config.DEF_COLOR
        }]}).catch(()=> {});

        await interaction.reply({
            embeds: [{
                description: "Bạn đã cảnh cáo **" + member.user.tag + "** lần " + userWarns + " với lí do: " + reason,
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        const dataLogger = new Database({ path: './data/guilds/' + interaction.guild.id + ".json" });
        
        // check data
        let logChannel = dataLogger.get('moderation-channel');
        if (!logChannel) return;

        // check channel
        let channel = client.channels.cache.get(logChannel);
        if (!channel) return;

        channel.send({
            embeds: [{
                title: "Moderation - Warn",
                fields: [
                    {
                        name: "Người thực hiện",
                        value: interaction.member.user.toString(),
                        inline: true
                    }, {
                        name: "Người áp dụng", 
                        value: member.user.tag,
                        inline: true
                    }, {
                        name: "Lí do cảnh cáo",
                        value: reason + " (" + userWarns + "warns)",
                        inline: false
                    },
                ],
                thumbnail: { url: member.user.avatarURL() },
                timestamp: new Date(),
                color: client.config.DEF_COLOR,
                footer: { text: member.user.id }
            }]
        }).catch(err => {
            client.sendError(interaction.errorInfo, err);
        });
    }
}