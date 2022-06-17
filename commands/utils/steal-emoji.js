const { Util, Permissions, Client, Message } = require('discord.js');
const { download, remove, isValidHttpUrl } = require("../../utils/utils");
module.exports = {
    name: "steal-emoji",
    description: "Nếu có nitro thì hãy trộm emoji cho máy chủ riêng của bạn.",
    aliases: ['steale', 'semoji', 'se'],
    usage: "<PREFIX>steal-emoji [emoji nitro 1] [emoji nitro 2]",
    ex: "<PREFIX>steal-emoji <:pepe_coffee:882613119644475442> <a:pepe_piumpium:882612313704775730>",
    delay: 5,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) return message.reply({
            embeds: [{
                description: "Bạn không có quyền ``Quản lí Emojis`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        if (!args.length) return message.reply({
            embeds: [{
                description: "Bạn phải nhập emoji cần lấy.\n\nCách sử dụng: " + client.prefix + "semoji <emoji 1> <emoji 2>...",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let countEmojis = 0;
        let stealEmo = [];
        let check = false;

        if(args.length > 3 && !client.isPremiumServer(message.guildId))
        return message.reply({
            embeds: [{
                description: "Chỉ có thể lấy 3 emoji 1 lần! Hãy nâng cấp Premium Server [tại đây](https://monbot.tk/discord).",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));
 

        args.forEach(async emojis => {
            if (!emojis.endsWith(">") || !emojis.startsWith("<") || !emojis.includes(":")) {
                let emoji = Util.parseEmoji(emojis);
                let parse = `${emoji.id}.${emoji.animated ? "gif" : "png"}`;

                if (emoji.id) emoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;
                
                let fileName = emojis.split(":")[1].split(":")[0];
                stealEmoji(fileName, emoji);
            } else {
                let valid = isValidHttpUrl(emojis);
                if(!valid) return;
                
                let fileName = emojis.split(":")[1].split(":")[0];
                stealEmoji(fileName, emoji);
            

            }
        });

        async function stealEmoji(fileName, url) {
            let dir = "./assets/emoji/" + parse;

            await download(dir, url);

            try {
                require("fs").readFile(dir, async (err, data) => {
                    await message.guild.emojis.create(data, fileName.split(".")[0])
                        .then(async emo => {
                            remove(dir);
                            stealEmo.push(emo.toString());
                        })
                        .catch(e => {
                            if(!check) { 
                                if(e.message.includes("Maximum number of emojis reached"))
                                    return message.reply({embeds: [{
                                        description: "Server của bạn không có đủ chỗ trống!"
                                    }]});
                                client.sendError(`Steal Emoji: \`\`\`${e}\`\`\``);
                                
                            }
                            check = true;
                        });
                    countEmojis++;
                });
            } catch (e) {
                client.sendError(message.errorInfo, e);
            }
        }

        setTimeout(async() => {
            if(!check) await message.reply({ embeds: [{
                description: "Đã thêm emoji vào server, hãy đợi ít phút",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false } });
        }, 2000);
    }
}