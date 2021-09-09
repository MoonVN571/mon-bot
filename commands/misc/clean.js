const { Client, Message } = require('discord.js');

module.exports = {
    name: 'clean',
    description: 'Xoá các tin nhắn đã gửi của bot trong kênh này',
    delay: 10,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        let count_message = 0;
        await message.channel.messages.fetch().then(async messages => {
            await messages.filter(msg => {
                if (msg.author == client.user) {
                    try {
                        client.channels.cache.get(message.channel.id).messages.fetch(msg.id).then(toMessage => { if (toMessage.deletable) toMessage.delete() });
                        count_message++;
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        });

        await message.channel.send({
            embeds: [{
                title: client.emoji.success + "Thành công",
                description: "Đã dọn ``" + count_message + " tin nhắn`` từ bot trong kênh này.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => setTimeout(() => msg.delete(), 10 * 1000));
    }
}