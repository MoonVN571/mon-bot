const { Client, Permissions, CommandInteraction } = require("discord.js");
const Database = require('simplest.db');

module.exports = {
    name: "unban",
    description: "bỏ cấm một người dùng bằng ID",
    type: "CHAT_INPUT",
    options: [
        {
            name: "userid",
            type: "NUMBER",
            description: "Nhập số tin nhắn cần xoá",
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
        let userToUnban = interaction.options.getNumber("userid");
        
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) returninteraction.followUp({
            embeds: [{
                decsription: "Bạn không có quyền để sử dụng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) returninteraction.followUp([{
            embeds: [{
                description: "Bot không đủ quyền ``Cấm Member`` để bỏ cấm người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }]).then(msg => client.msgDelete(msg));

        var er = false;

        interaction.guild.members.unban(userToUnban, "Unbanned by " + interaction.member.user.id).catch(error => {
            er = true;
            if (error.toString().includes("Couldn't resolve the user id to unban.")) returninteraction.followUp({
                embeds: [{
                    description: "Bạn phải nhập ID người dùng hợp lệ",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));

            if (error.toString().includes("Unknown Ban")) return interaction.followUp({
                embeds: [{
                    description: "Không tìm thấy danh sách cấm của người này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            }).then(msg => client.msgDelete(msg));
            console.log(error);
            client.sendError(interaction.errorInfo, error);
        });

        if (er) return;

        client.users.fetch(userToUnban).then(user => {
           interaction.followUp({
                embeds: [{
                    description: "**" + user.tag + "** đã được thu hồi lệnh cấm.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            const dataLogger = new Database({ path: './data/guilds/' + interaction.guild.id + '.json' });

            // check data
            let logChannel = dataLogger.get('moderation-channel');
            if (!logChannel) return;

            // check channel
            let channel = client.channels.cache.get(logChannel);
            if (!channel) return;

            channel.send({
                embeds: [{
                    title: "Moderation - Unban",
                    fields: [
                        {
                            name: "Người thực hiện",
                            value: interaction.member.user.toString(),
                            inline: true
                        }, {
                            name: "Người áp dụng",
                            value: user.tag,
                            inline: true
                        }
                    ],
                    thumbnail: { url: user.avatarURL() },
                    timestamp: new Date(),
                    footer: { text: member.user.id },
                    color: client.config.DEF_COLOR
                }]
            });
        });
    }
}