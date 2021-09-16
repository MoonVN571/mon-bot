module.exports = {
    name: "membercount",
    description: "Xem số thành viên trong nhóm",

    execute(client, message, args) {
        message.reply({
            embeds: [{
                title: "Server Member",
                fields: [
                    {
                        name: "Total users",
                        value: message.guild.memberCount.toString(),
                        inlnie: true
                    },
                    {
                        name: "Total bots",
                        value: message.guild.members.cache.filter(u => u.user.bot).size.toString(),
                        inline: true
                    }
                ],
                timestamp: new Date(),
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}