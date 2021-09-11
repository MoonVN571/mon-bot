const { Client, Message } = require('discord.js');

module.exports = {
    name: 'clean',
    description: 'Xoá các tin nhắn đã gửi của bot trong kênh này',
    delay: 20,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        let count_message = 0;
        await message.channel.messages.fetch({ limit: 50 }).then(async messages => {
            let userMessage = messages.filter(msg => msg.content.startsWith(client.prefix)).map((msg) => msg);
            let botMessage =  messages.filter(msg => msg.author.id === client.user.id).map(msg => msg);

            count_message = botMessage.length + userMessage.length;

            await message.channel.bulkDelete(userMessage, true);
            await message.channel.bulkDelete(botMessage, true);
        });

        await message.channel.send({
            embeds: [{
                title: client.emoji.success + "Thành công!",
                description: "Đã dọn ``" + count_message + " tin nhắn`` trong kênh.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => setTimeout(() => { if(msg.deletable) msg.delete()}, 10 * 1000));
    }
}