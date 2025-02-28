module.exports = {
    name: "sv-avatar",
    description: "Xem avatar của server",
    aliases: ['svavt', 'sv-avt', 'sav', 'sv-av'],

    execute(client, message, args) {
        if (!message.guild.iconURL()) return message.reply({ embeds: [{
            description: "Server không có ảnh.",
            color: client.config.ERR_COLOR
        }], allowedMentions: { repliedUser: false } }).then(msg => client.msgDelete(msg));
        message.reply({
            embeds: [{
                title: "Ảnh của server " + message.guild.name + "'s",
                image: { url: message.guild.iconURL({ dynamic: true, size: 4096 }) },
                color: client.config.DEF_COLOR,
                timestamp: new Date()
            }], allowedMentions: { repliedUser: false }
        });
    }
}