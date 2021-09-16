var os = require("os");

var { MessageEmbed } = require('discord.js');

const { getAge, getTimestamp } = require('../../utils/utils');

module.exports = {
    name: "botinfo",
    description: "Xem thông tin và thông tin hosting bot",
    aliases: ['bi'],
    delay: 3,

    async execute(client, message, args) {
        var user = client.users.cache.get("425599739837284362");
        var bot = client.users.cache.get(client.user.id);

        var authorID = user.username + "#" + user.discriminator;
        var botID = bot.username + "#" + bot.discriminator;

        var embed = new MessageEmbed()
            .addField("\u300B General",
                "-   **Tên bot:** " + botID + " (ID: 768448728125407242)\n"
                + "-   **Người tạo:** " + authorID + " (ID: 425599739837284362)\n"
                + "-   **Ngày tạo bot:** " + getTimestamp(bot.createdAt) + "\n"
                + "-   **Bot version:** " + require("./../../package.json").version + "\n"
                + "-   **Discord.js version:** " + require("discord.js").version + "\n"
                + "-   **Tổng server:** " + Intl.NumberFormat().format(client.guilds.cache.size) + "\n"
                + "-   **Tổng kênh:** " + Intl.NumberFormat().format(client.channels.cache.size) + "\n"
                + "-   **Người dùng:** " + Intl.NumberFormat().format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)) + "\n\u200B"
            )
            .addField("\u300B System",
                `-   **Hệ điều hành:** ${os.type()}` + "\n"
                + `-   **Thời gian đã hoạt động:** ${getAge(new Date().getTime() - os.uptime() * 1000)}` + "\n"
                + `-   **Ram đã dùng:** ${((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)} MB\n`
                // + "-   **Process:** " + os.cpus()[0].model + "\n"
                // + "-   **Core:** " + os.cpus().length + "\n"
                // + "-   **Speed:** " + os.cpus()[0].speed + "MHz"
            )
            .setColor(client.config.DEF_COLOR)
            .setTimestamp();

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}