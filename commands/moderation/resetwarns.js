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
                title: client.emoji.failed + " Thiếu quyền!",
                description: "Bạn không có quyền ``MANAGE_GUILD`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Thiếu thông tin!",
                description: "Bạn phải cung cấp người dùng cần cảnh cáo.*.\n\nVí dụ: " + client.prefix + "warn <tag/id> [lí do]",
                footer: "Cú pháp <>: Bắt buộc; []: Không bắt buộc",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        var warnUser = message.mentions.members.first() || args[0];
        if (warnUser) warnUser = warnUser.id;

        const member = message.guild.members.cache.get(warnUser);
        if (!member) return message.reply({
            embeds: [{
                title: client.emoji.failed + " Sai thông tin!",
                description: "Không tìm thấy ngườ này trong nhóm.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        // lay guild id
        const dataWarn = new Database({ path: "./data/warnings/" + message.guild.id + ".json" });
        dataWarn.delete(member.user.id);

        message.reply({
            embeds: [{
                title: client.emoji.success + "Thành công!",
                description: "Bạn xoá hết cảnh cáo cho **" + member.user.tag + "**.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}