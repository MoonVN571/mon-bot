const {Client,CommandInteraction,Permissions}= require('discord.js');
const Database = require("simplest.db");
module.exports = {
    name: "ban",
    description: "Cấm 1 user trong server",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            type: "USER",
            description: "Cung cấp người cần ban",
            required: true
        },
        {
            name: "reason",
            type: "STRING",
            description: "Lí do ban",
            required: false
        }
    ],
    userPermissions: ["BAN_MEMBERS"],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
     execute: async (client, interaction, args) => {
        let user = interaction.options.getMember("user");
        let reason = interaction.options.getString("reason") || "Không có";

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return await interaction.reply({
            embeds: [{
                description: "Bạn không có quyền ``Ban Member`` để sử dụng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return await interaction.reply([{
            embeds: [{
                description: "Bot không có quyền ``Ban Member`` để cấm người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        }]);
        
        let userToBan = user.user.id;

        if (userToBan == interaction.user.id) return await interaction.reply({
            embeds: [{
                description: "Bạn không thể cấm chính mình.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (user == client.user) return interaction.reply({
            embeds: [{
                description: "Mình không thể ban chính mình.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });
        
        const member = await interaction.guild.members.fetch(userToBan);

        if (!member) return interaction.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng trong server này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (!member.bannable) return interaction.reply({
            embeds: [{
                description: "Bot không đủ quyền để cấm người này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        // punish
        await member.send({embeds: [{
            title: "BANNED",
            description: "Bạn đã bị cấm khỏi server **" + interaction.guild.name + "**, lí do: *" + reason + "*.",
            timestamp: new Date(),
            color: client.config.DEF_COLOR
        }]}).catch(()=> {});

        await sleep(2000);
        
        await member.ban({ days: 7, reason: reason }).then(async() => {
            await interaction.reply({
                embeds: [{
                    description: "**" + member.user.tag + "** đã bị cấm với lí do: *" + reason + "*.",
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
                    title: "Moderation - Ban",
                    fields: [
                        {
                            name: "Người thực hiện",
                            value: interaction.user.toString(),
                            inline: true
                        }, {
                            name: "Người áp dụng",
                            value: member.user.tag,
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
            }).catch(()=>{});
        }).catch(err => {
            client.sendError(interaction.errorInfo, err);
            interaction.botError();
        });
    }
}