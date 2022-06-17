const Database = require("simplest.db");
const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");
const { sleep } = require("../../utils/utils");
const { removeEmpty }= require('../../utils/object');
module.exports = {
    name: "embed",
    description: "Tạo embed bằng bot này, gõ /ex-embed để xem mẫu nếu cần.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'send_to',
            description: 'Gửi tin nhắn đến kênh nào đó, bỏ trống để gửi vào kênh hiện tại.',
            type: "CHANNEL",
            required: false
        },
        {
            name: 'object',
            description: "Gửi object embed message, xem tại /c-embed",
            type: 'STRING',
            required: false
        },
        {
            name: 'title',
            type: "STRING",
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'description',
            type: 'STRING',
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'field_name',
            type: 'STRING',
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'field_value',
            type: 'STRING',
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'author_icon_url',
            type: 'STRING',
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'author_value',
            type: 'STRING',
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'footer_value',
            type: "STRING",
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'footer_icon_url',
            type: "STRING",
            description: "Gõ /ex-embed - Xem chi tiết hoặc value nếu như bạn chưa rõ!",
            required: false
        },
        {
            name: 'thumbnail',
            type: "BOOLEAN",
            description: "Hiện thời gian gửi embed này!",
            required: false
        },
        {
            name: 'image',
            type: "STRING",
            description: "Hiện thời gian gửi embed này!",
            required: false
        },
        {
            name: 'timestamp',
            type: "BOOLEAN",
            description: "Hiện thời gian gửi embed này!",
            required: false
        },
        {
            name: 'color',
            type: "STRING",
            description: "Nhập Color hex để hiện màu embed",
            required: false
        },
        {
            name: 'custom_object_embed',
            description: "GÕ /c-embed - Để xem object tạo embed",
            type: 'STRING',
            required: false
        }
    ],
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
        
        await interaction.reply({
            embeds: [{
                description: "Đang kiểm tra thông tin...",
                color: client.config.PROCESS_COLOR,
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        await interaction.editReply({
            embeds: [{
                description: "Đang tạo embed cho bạn!",
                color: client.config.PROCESS_COLOR,
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        let channel = interaction.options.getChannel('send_to');
        let title = interaction.options.getString('title');
        let desc = interaction.options.getString('description');
        let author_value = interaction.options.getString('author_value');
        let author_url = interaction.options.getString('author_icon_url');
        let field_name = interaction.options.getString('field_name');
        let field_value = interaction.options.getString('field_value');
        let footer_value = interaction.options.getString('footer_value');
        let footer_url = interaction.options.getString('footer_icon_url');
        let timestamp = interaction.options.getBoolean('timestamp');
        let color = interaction.options.getString('color');

        let object = interaction.options.getString('object');

        if(object) {
            return await interaction.editReply({content: "Chưa hỗ trợ!", ephemeral: true});
            let format;
            try {
                format = JSON.parse(object);
                if(!format.description && !format.title && !format.footer && !format.footer.text && !format.fields  || !format.fields[0] && !format.fields[0].name)
                    return await interaction.editReply({
                        embeds: [{
                            description: "Cung cấp ít nhất 1 giá trị string!",
                            color: client.config.ERR_COLOR
                        }], ephemeral: true
                    });
            } catch(e) {
               format = undefined; 
               console.log(e);
            }

            if(!format) return await interaction.editReply({
                embeds: [{
                    description: "Không thể giải quyết object embed thử lại sau!",
                    color: client.config.ERR_COLOR
                }], ephemeral: true
            });

            if(!channel) interaction.channel.send({embeds: [globalEMbed]}).then(msg => {
                const embed = new Database({ path: './data/savedGuildData/embeds/' + interaction.guildId + '.json' });

                embed.set( msg.channelId + "." + msg.id, removeEmpty(JSON.parse(JSON.stringify((msg.embeds[0])))));
            });
            return;
        }

        await sleep(2000);

        try {
            let globalEmbed = new MessageEmbed();

            if (title) globalEmbed.setTitle(title);
            if (desc) globalEmbed.setDescription(desc);
            if (author_value) globalEmbed.setAuthor(author_value, author_url);
            if(field_name && field_value) globalEmbed.setFields(field_name, field_value);
            if(footer_value) globalEmbed.setFooter(footer_value);
            if (footer_url && footer_value) globalEmbed.setFooter(footer_value, footer_url);
            if (timestamp) globalEmbed.setTimestamp();
            if (color) globalEmbed.setColor(color);

            await interaction.guild.channels.cache.get(channel||interaction.channel.id).send({ embeds: [globalEmbed] }).then(msg => {
                const embed = new Database({ path: './data/savedGuildData/embeds/' + interaction.guildId + '.json' });

                embed.set( msg.channelId + "." + msg.id, removeEmpty(JSON.parse(JSON.stringify((msg.embeds[0])))));
            });

            await interaction.editReply({
                embeds: [{
                    description: "Tạo embed thành công!",
                    color: client.config.DEF_COLOR,
                }], allowedMentions: { repliedUser: false },
                ephemeral: true
            });
        } catch (e) {
            console.log(e);
            await interaction.editReply({
                embeds: [{
                    description: "Không thể gửi embed thử lại sau!",
                    color: client.config.ERR_COLOR,
                }], allowedMentions: { repliedUser: false },
                ephemeral: true
            });
        }
    },
};