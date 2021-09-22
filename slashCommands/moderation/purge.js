const { Client, CommandInteraction, Permissions } = require("discord.js");
module.exports = {
    name: 'purge',
    description: "Đá một người dùng khỏi server",
    type: "CHAT_INPUT",
    options: [
        {
            name: "messages",
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
     execute: async (client, interaction, args) => {
        let deleteCount = interaction.options.getNumber("messages");

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return await interaction.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Tin nhắn`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        }).then(msg => client.msgDelete(msg, 5000));

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return await interaction.reply({
            embeds: [{
                description: "Bot không có quyền ``Quản lí Tin nhắn`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return await interaction.reply({
            embeds: [{
                description: "Bạn chỉ có thể xoá 2 đến 100 tin nhắn trong 1 lần.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        try {
            interaction.channel.bulkDelete(deleteCount).then(() => {
                interaction.channel.send("Đã dọn được ``" + deleteCount + " tin nhắn``!").then(msg => client.msgDelete(msg, 10000));
            }).catch(async error => {
                if (error.toString().includes("14 days old")) return await interaction.reply({
                    embeds: [{
                        description: "Không thể xoá tin nhắn đã trên 14 ngày.",
                        color: client.config.ERR_COLOR
                    }], allowedMentions: { repliedUser: false },
                    ephemeral: true
                });
                console.log(error);
                client.sendError(`${message.errorInfo} Can not bulk delete: \`\`\`${error}\`\`\``);
            });
        } catch (e) {
            client.sendError(interaction.errorInfo, e);
            interaction.botError();
        }
    }
}