module.exports = {
    name: "resetwarns",
    description: "Xoá số lần cảnh cáo của người dùng trong server",
    usage: "<PREFIX>resetwarns <user/tag>",
    ex: "<PREFIX>resetwarns <BOT_MENTIONS>",


    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
        ) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Server`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp người dùng cần cảnh cáo.\nCách sử dụng: " + client.prefix + "warn <tag/id> [lí do]",
                footer: {text:"Cú pháp <>: Bắt buộc - []: Không bắt buộc"},
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        var warnUser = message.mentions.members.first() || args[0];
        if (warnUser) warnUser = warnUser.id;

        const member = message.guild.members.cache.get(warnUser);
        if (!member) return message.reply({
            embeds: [{
                description: "Không tìm thấy người này trong server",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        // lay guild id
        const dataWarn = new Database({ path: "./data/warnings/" + message.guild.id + ".json" });
        dataWarn.delete(member.user.id);

        message.reply({
            embeds: [{
                description: "Bạn xoá hết cảnh cáo cho **" + member.user.tag + "**.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}