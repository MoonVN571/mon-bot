const { Client, CommandInteraction,Permissions } = require("discord.js");

module.exports = {
    name: "c-embed",
    description: "Mẫu tạo tin nhắn bằng embed bot",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    execute: async (client, interaction, args) => {
        
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
            return interaction.reply({embeds: [{
                description: "Bạn phải có quyền ``Quản lí Server`` để dùng lệnh này!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false},
            ephemeral: true
        });
        
        return await interaction.reply({content: "Hiện tại chưa hỗ trợ!", ephemeral: true });

        await interaction.reply({
            content:
                "Tự setup object embed, có thể xem [tại đây](https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object)"
                + ". Như này gọi là [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object),"
                + " khi setup cũng thế!\nVí dụ: ```json\n{\n    \"text\": \"Hellow World!\"     \n}``` Khi setup thì phải theo object kiểu thế này!",
                ephemeral: true
        });
    },
};
