const { Client,CommandInteraction,Permissions } = require("discord.js");
const Database=require('simplest.db');
module.exports = {
    name: "resetwarns",
    description: "Xoá số lần cảnh cáo của người dùng trong server",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            type: "USER",
            description: "Cung cấp người cần xoá cảnh cáo",
            required: true
        },
    ],


    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    async execute(client, interaction, args) {
        let warnUser = interaction.options.getMember("user");
        
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
        ) return interaction.followUp({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        const member = await interaction.guild.members.fetch(userToMute);
        if (!member) return interaction.followUp({
            embeds: [{
                description: "Không tìm thấy người này trong server",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        // lay guild id
        const dataWarn = new Database({ path: "./data/warnings/" + interaction.guild.id + ".json" });
        dataWarn.delete(member.user.id);

        interaction.followUp({
            embeds: [{
                description: "Bạn xoá hết cảnh cáo cho **" + member.user.tag + "**.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}