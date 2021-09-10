const { Util, Permissions, Client, Message } = require('discord.js');
const { download, remove } = require("../../utils/utils");

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
                title: client.emoji.failed + "Thiêu quyền!",
                description: "Bạn không có quyền ``MANAGE_EMOJIS_AND_STICKERS`` để dùng lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!args.length) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin!",
                description: "Bạn phải nhập emoji cần lấy.\n\nCâu lệnh: " + client.prefix + "semoji <emoji 1> <emoji 2>...",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });
        var countEmojis = 0;

        args.forEach(async emojis => {
            if (!emojis.endsWith(">") || !emojis.startsWith("<") || !emojis.includes(":")) return;

            let emoji = Util.parseEmoji(emojis);
            let parse = `${emoji.id}.${emoji.animated ? "gif" : "png"}`;

            if (emoji.id) emoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;

            let fileName = emojis.split(":")[1].split(":")[0];

            let dir = "./assets/emoji/" + parse;

            await download(dir, emoji);

            try {
                require("fs").readFile(dir, async (err, data) => {
                    await message.guild.emojis.create(data, fileName.split(".")[0])
                        .then(() => remove(dir))
                        .catch(e => console.log(e));
                    countEmojis++;
                });
            } catch (e) {

            }
        });

        await message.reply({ embeds: [{
            title: client.emoji.success + "Thành công!",
            description: 'Đã thêm các emoji vào máy chủ của bạn!',
            color: client.config.DEF_COLOR
        }], allowedMentions: { repliedUser: false } });

    }
}