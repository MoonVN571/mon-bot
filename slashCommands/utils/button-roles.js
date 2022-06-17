const { Client, CommandInteraction, MessageActionRow, MessageButton, Permissions } = require("discord.js");
const Database = require('simplest.db');
module.exports = {
    name: "button-roles",
    description: "Setup reaction role 1 tin nhắn",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "Cung cấp channel để gửi vào hoặc bỏ trống để gửi kênh hiện tại",
            required: true
        },
        {
            name: "id_message",
            type: "STRING",
            description: "Cung cấp ID tin nhắn của bot",
            required: true
        },
        {
            name: "role",
            type: "ROLE",
            description: "Role give khi bấm",
            required: true
        },
        {
            name: "button_text",
            type: "STRING",
            description: "Từ trên nút bấm",
            required: true
        },
        {
            name: "button_emoji",
            type: "STRING",
            description: "Emoji của nút bấm",
            required: false
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    execute: async (client, interaction, args) => {
        let channel = interaction.options.getChannel("channel");
        let id_msg = interaction.options.getString("id_message");
        let button_emoji = interaction.options.getString("button_emoji");
        let button_text = interaction.options.getString("button_text");
        let role = interaction.options.getRole("role");
        
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

        // check channel
        let checkCh = await interaction.channel.fetch(channel?.id);

        if(!checkCh || !checkCh.isText()) return await interaction.editReply({
            embeds: [{
                description: "Kênh không hợp lệ thử lại sau!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        // check emo
        /*
        if(button_emoji && !(button_emoji.startsWith("<:") && button_emoji.endsWith(">")))
            return interaction.editReply({
                embeds: [{
                    description: "Emoji cung cấp không hợp lệ!",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false },
                ephemeral: true
            }); */
    

        // client.channels.cache.get(checkCh.id).fetch;
        
        // check role
        if(interaction.guild.me.roles.highest < role.position) return await interaction.editReply({
            embeds: [{
                description: "Role của bot phải __cao hơn__ để setup button role!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        ///reactionrole channel:#bot-projects id_message:890528206623485962 button_emoji::thumbsup: button_text:test role:@test 

        let checkChannel = interaction.guild.channels.cache.get(checkCh.id);

        const db = new Database({path: "./data/savedGuildData/embeds/" + interaction.guildId + ".json"});
        let eb = db.get(channel + "." + id_msg); // embed obj

        const limitDb = new Database({path: "./data/savedGuildData/button-roles/" + interaction.guildId + ".json"});
        let getLimitCount = limitDb.get("limit-roles");

        if(getLimitCount > 1 && !client.isPremiumServer(interaction.guildId))
            return interaction.editReply({embeds: [{
                description: "Server của bạn đã đạt giới hạn button role!\nNếu bạn muốn dùng thêm, hãy nâng cấp Premium ở Server Support của bot [tại đây](https://monbot.tk/discord)",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false},
            ephemeral: true
        });

        if(!db || !eb) return await interaction.editReply({
            embeds: [{
                description: "Hãy setup embed!\nCách setup: /embed - Xem chi tiết, /ex-embed - Xem mẫu embed",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        const buttonDb = new Database({path: "./data/savedGuildData/button-roles/"+ interaction.guildId + ".json"});
        let totalButtons = buttonDb.get('total-buttons') || 0;

        if(totalButtons > 7) return await interaction.editReply({
            embeds: [{
                description: "Bạn đã đạt giới hạn tạo button role trên cùng 1 embed!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false },
            ephemeral: true
        });

        limitDb.number.add("limit-roles", 1);

        await checkChannel.messages.fetch(id_msg).then(async msg => {
            if(msg.author.id !== client.user.id) return await interaction.editReply({
                embeds: [{
                    description: "Hãy setup embed và tin nhắn từ bot này!\nCách setup: /embed - Xem chi tiết, /ex-embed - Xem mẫu embed",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false },
                ephemeral: true
            });

            let newButton = new MessageButton()
                .setCustomId("button-roles." + channel + "." + id_msg + "." + role.id)
                .setLabel(button_text)
                .setEmoji(button_emoji)
                .setStyle("PRIMARY");


            if(!buttonDb.get(checkChannel.id + "." + id_msg + ".buttons")) await buttonDb.set(checkChannel.id + "." + id_msg + ".buttons", []);

            let arrButtondata = await buttonDb.get(checkChannel.id + "." + id_msg + ".buttons");
            let arr = arrButtondata;
            await arr.push(newButton);
            let arrButton = arr;

            const button = new MessageActionRow();
            await arrButton.forEach(async data => {
                button.addComponents(data);
                buttonDb.array.push(checkChannel.id + "."  + id_msg + '.buttons',data);
            });

            buttonDb.number.add('total-buttons',1);

            if(!buttonDb.get('to-load')) buttonDb.set("to-load", []);
            buttonDb.array.push("to-load", msg.channel.id + " " + msg.id);

            await interaction.editReply({
                embeds: [{
                    description: "Đã setup thành công! Kiểm tra lại tin nhắn để xem sự thay đổi!",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false },
                ephemeral: true
            });

            buttonDb.array.push(checkChannel + "."  + id_msg + '.roles', role.id);

            msg.edit({
                components: [button]
            }).then(() => {
                // create collection
                const filter = (interaction) => {
                    return !interaction.user.bot;
                };
                const collector = msg.createMessageComponentCollector({ filter,componentType: "BUTTON" });
                collector.on('collect', async interaction => {
                    // try {
                        if (interaction.customId === "button-roles." + channel + "." + id_msg +"."+ role.id) {
                            // await interaction.reply({content: "Bạn đã được thêm role ``" + role.name + "``.", ephemeral: true});

                            if(interaction.member.roles.cache.some(r => r.name == role.name)) {
                                interaction.member.roles.remove(role.id).catch(() => {});
                                await interaction.reply({content: "Đã bỏ role ``" + role.name + "``.", ephemeral: true}).catch(() => {});
                                return;
                            }
                            
                            interaction.member.roles.add(role.id).catch(() => {});
                            await interaction.reply({content: "Đã thêm role ``" + role.name + "``.", ephemeral: true}).catch(() => {});
                        }
                    // } catch(e) {
                    //     client.sendError('button',e);
                    //     await interaction.reply({content: "Bot xảy ra lỗi thử lại sau!", ephemeral: true});
                    // }
                });
            });
        }).catch(err =>{
            if(err.message == "Unknown Message") 
                return interaction.reply({embeds: [{
                    description: "Không thể tạo nút bấm của tin nhắn đã bị xoá!",
                    color: client.config.ERR_COLOR
                }], ephemeral: true });
            client.sendError(interaction.errorInfo, err);
            interaction.botError();
        });
    },
};