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
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            embeds: [{
                description: "Bot không có quyền ``Quản lí Tin nhắn`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 5000));

        let count_message = 0;
        await message.channel.messages.fetch({ limit: 50 }).then(async messages => {
            let userMessage = messages.filter(msg => msg.content.startsWith(client.prefix)).map((msg) => msg.id);
            let botMessage =  messages.filter(msg => msg.author.id === client.user.id).map(msg => msg.id);

            count_message = botMessage.length + userMessage.length;

            await message.channel.bulkDelete(userMessage, true);
            await message.channel.bulkDelete(botMessage, true);
        });

        await message.channel.send({
            embeds: [{
                description: "Đã dọn ``" + count_message + " tin nhắn``.",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg, 10 * 1000));
    }
}