const Database = require('simplest.db');

const { validImageUrl, download } = require('../../utils/utils');

module.exports = {
    name: 'set-image',
    description: "Đặt đã có image",
    dev: true,
    discordDev: true,

    async execute(client, message, args) {
        if (!args[0]) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin",
                description: "Bạn phải cung cấp ID nhóm cần thêm ảnh welcome.",
                color: client.config.ERR_COLOR
            }]
        });

        if (!client.guilds.cache.get(args[0])) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Sai thông tin",
                description: "Nhóm ID này không hợp lệ hoặc không có bot.",
                color: client.config.ERR_COLOR
            }]
        });

        if (!args[1] && !message.attachments) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin",
                description: "Hãy cung cấp ảnh hoặc link ảnh.\n*" + client.prefix + 'set-image <Guild ID> <Image url/ image>*',
                color: client.config.DEF_COLOR
            }]
        });

        // check attachmemnt
        let image = args[1];
        await message.attachments.forEach(img => image = img.url);

        // check url
        let validImage = await validImageUrl(image, message.guild.id);


        if (!validImage) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Sai thông tin",
                description: "Ảnh cung cấp không hợp lệ hoặc sai định dạng.",
                color: client.config.DEF_COLOR
            }]
        });


        const imgData = new Database({ path: './data/guilds/' + message.guild.id + ".json" });

        imgData.set('has-image', true);

        await download('./assets/welcome/' + message.guild.id + ".png", image);
        await delete ('./assets/welcome/process/' + message.guild.id + ".png", image);

        message.reply({
            embeds: [{
                title: client.emoji.success + "Thao tác thành công",
                description: "Đã đặt ảnh cho nhóm tên " + client.guilds.cache.get(args[0]).name + ".",
                color: client.config.DEF_COLOR,
                image: { url: image }
            }]
        })
    }
}