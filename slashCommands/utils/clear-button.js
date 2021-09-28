const { Client, CommandInteraction } = require("discord.js");
const Database = require('simplest.db');
module.exports = {
    name: "clear-button",
    description: "Xoá tất cả nút trên embed",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "channel",
            description: "Kênh tin nhắn đã được gửi vào kênh",
            type: "CHANNEL",
            required: true
        },
        {
            name: "id_message",
            description: "ID tin nhắn để xoá",
            type: "STRING",
            required: true
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    async execute (client, interaction, args) {
        let channel = interaction.options.getChannel('channel');
        let idmessage = interaction.options.getString('id_message');

        if(!channel.isText()) return interaction.reply({
            embeds: [{
                description: "Bạn phải nhập kênh hợp lệ!",
                color: client.config.ERR_COLOR
            }], ephemeral: true
        });

        const db = new Database({path: "./data/savedGuildData/embeds/" + interaction.guildId + ".json"});
        let eb = db.get(channel + "." + idmessage);
        if(!db || !eb) return await interaction.reply({
            embeds: [{
                description: "Bạn cung cấp tin nhắn không hợp lệ!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        client.channels.cache.get(channel.id).messages.fetch(idmessage).then(msg => {
            msg.edit({embeds: [eb], components: []});
            interaction.reply({embeds: [{
                description: "Đã xoá các nút thành công!",
                color: client.config.DEF_COLOR
            }], ephemeral: true });
        }).catch(err => {
            if(err.message == "Unknown Message") 
                return interaction.reply({embeds: [{
                    description: "Không thể xoá các nút của tin nhắn đã bị xoá!",
                    color: client.config.ERR_COLOR
                }], ephemeral: true });
            client.sendError(interaction.errorInfo, err);
            interaction.botError();
        });
    }
}
