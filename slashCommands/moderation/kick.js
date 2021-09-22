const { Client, CommandInteraction, Permissions } = require("discord.js");
const Database = require('simplest.db');
const { sleep}=require('../../utils/utils');
module.exports = {
    name: 'kick',
    description: "Đá một người dùng khỏi server",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            type: "USER",
            description: "Cung cấp người cần kick",
            required: true
        },
        {
            name: "reason",
            type: "STRING",
            description: "Lí do kick",
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

        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return await interaction.reply({
            embeds: [{
                description: "Bạn không có quyền để sử dụng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });
        
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return await interaction.reply([{
            embeds: [{
                description: "Bot không đủ quyền để cấm người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        }]);

        const member = await interaction.guild.members.fetch(user);

        if (userToKick == interaction.member.user.id) return await interaction.reply({
            embeds: [{
                description: "Bạn không thể kick chính mình.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (member.user == client.user) return await interaction.reply({
            embeds: [{
                description: "Mình không thể đá chính mính.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (!member) return await interaction.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng trong server này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (!member.kickable) return await interaction.reply({
            embeds: [{
                description: "Bot không đủ quyền để kick người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        // punish
        await member.send({embeds: [{
            title: "KICKED",
            description: "Bạn đã bị kick khỏi server **" + interaction.guild.name + "**, lí do: *" + reason + "*.",
            timestamp: new Date(),
            color: client.config.DEF_COLOR
        }]}).catch(()=> {});

        await sleep(2000);

        await member.kick(reason).then(async() => {
            await interaction.reply({
                embeds: [{
                    description: "**" + member.user.tag + "** đã bị kick với lí do: *" + reason + "*.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false },
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
                    title: "Moderation - Kick",
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
                client.sendError(interaction.errorInfo, err);
            });
        }).catch(err => {
            interaction.botError();
            client.sendError(interaction.errorInfo, err);
        });
    }
}