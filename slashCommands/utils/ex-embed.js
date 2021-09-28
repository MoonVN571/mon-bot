const { Client, CommandInteraction,Permissions } = require("discord.js");

module.exports = {
    name: "ex-embed",
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
        
        await interaction.reply({ content:
            "author_icon_url - Link ảnh là ở trước cái author_value\n"
            + "icon_name - Tên nhỏ sau ảnh, lưu ý: Bắt buộc là text để show\n"
            + "footer_icon_url - Ảnh nhỏ ở trước footer value\n"
            + "timestamp - Thời gian ở sau footer value\n"
            + "color - Mã màu hex, có thể kham khảo [tại đây](https://color-hex.com/)\n"
            + "image - hình ảnh to bên dưới\n"
            + "thumbnail - Hình ảnh nhỏ ở gốc phải\n"
            // + "\n\n ^^^^ Phần trên này là ``content``"
            ,
            embeds: [{
                title: "title - Tiêu đề",
                author: {
                    name: "author_value - " + client.user.username,
                    icon_url: client.user.avatarURL()
                },
                description: "description - Mô tả, có thể ``\\n`` để xuống dòng",
                fields: [
                    {
                        name: 'field_name - Tên field',
                        value: 'field_value - Mô tả field'
                    }
                ],
                footer: {
                    text: "footer_value - Footer đây!!",
                    icon_url: client.user.avatarURL()
                },
                thumbnail: {
                    url: "https://cdn.discordapp.com/attachments/795842485133246514/890889233735233537/843px-HERE_logo.png",
                },
                image: {
                    url: "https://cdn.discordapp.com/attachments/883891079244562503/890529896911216681/nature-3082832__480.png"
                },
                color: client.config.DEF_COLOR,
                timestamp: new Date()
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        // await interaction.reply({
        //     content:
        //         "author_icon_url - Link ảnh là ở trước cái author_value\n"
        //         + "icon_name - Tên nhỏ sau ảnh, lưu ý: Bắt buộc là text để show\n"
        //         + "footer_icon_url - Ảnh nhỏ ở trước footer value\n"
        //         + "timestamp - Thời gian ở sau footer value\n"
        //         + "color - Mã màu hex, xem [tại đây](https://color-hex.com/)",
        //         ephemeral: true
        // });
    },
};