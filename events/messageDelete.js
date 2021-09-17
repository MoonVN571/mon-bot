const Database = require('simplest.db');
const client = require('../index');

client.on('messageDelete', async (message) => {
    if (message.author.bot) return;

    let db = new Database({ path: './data/snipe.json' });

    db.set(message.channel.id, {
        content: message.content,
        author: message.author,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : ""
    });

    if (!message.mentions.members.first()) return;
    if (client.Pings.has(`pinger:${message.guild.id}${message.mentions.members.first().id}`)) {
        message.channel.send({
            embeds: [{
                title: "Ghost Ping Detector",
                fields: [
                    {
                        name: "Người gửi",
                        value: message.author.toString() + "",
                        inline: true
                    }, {
                        name: "Nội dung gửi",
                        value: message.content + "",
                        inline: true
                    }],
                color: client.config.DEF_COLOR,
                timestamp: new Date()
            }]
        });
    }
});