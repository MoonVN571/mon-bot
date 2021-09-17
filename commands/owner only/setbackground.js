const Database = require('simplest.db');

const { validImageUrl, download } = require('../../utils/utils');

module.exports = {
    name: 'setbackground',
    description: "Đặt đã có image",
    dev: true,
    discordDev: true,

    async execute(client, message, args) {
        if (!args[0]) return message.reply({
            content: "Cung cấp ID server",
            allowedMentions: { repliedUser: false }
        });

        if (!client.guilds.cache.get(args[0])) return message.reply({
            content: "Không tìm thấy server này",
            allowedMentions: { repliedUser: false }
        });

        if (!args[1] && !message.attachments) return message.reply({
            content: "Cung cấp ảnh hoặc link cần set",
            allowedMentions: { repliedUser: false }
        });

        // check attachmemnt
        let image = args[1];
        await message.attachments.forEach(img => image = img.url);

        // check url
        let validImage = await validImageUrl(image, message.guild.id);


        if (!validImage) return message.reply({
            embeds: [{
                description: "Ảnh cung cấp không hợp lệ hoặc sai định dạng.",
                color: client.config.ERR_COLOR
            }]
        });

        const imgData = new Database({ path: './data/guilds/' + message.guild.id + ".json" });

        imgData.set('has-image', true);

        await download('./assets/welcome/' + message.guild.id + ".png", image);
        await remove('./assets/welcome/process/' + message.guild.id + ".png", image);

        message.reply({
            embeds: [{
                description: "Đã đặt ảnh cho nhóm tên " + client.guilds.cache.get(args[0]).name + ".",
                color: client.config.DEF_COLOR,
                image: { url: image }
            }]
        })
    }
}