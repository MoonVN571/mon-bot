require('dotenv').config();
const axios = require("axios");
module.exports = {
    name: "banner",
    description: "Lấy ảnh nền của người dùng",
    aliases: ['bg', 'background', 'banner', 'anhnen'],
    usage: '<PREFIX>banner [username/tag/id]',
    ex: '<PREFIX>banner MoonU',
    delay: 3,

    async execute(client, message, args) {
        var user = args[0] || message.author.id;
        var tag = message.mentions.members.first();

        if (isNaN(user) && !tag) user = message.author.id;
        if (tag) user = tag.id;

        let check_name = client.users.cache.find(user => user.username.toLowerCase() == args.join(" ").toLowerCase());
        if (check_name) user = check_name.id;

        if (!check_name && !tag && isNaN(user) || !tag && isNaN(user)) return message.reply({
            embeds: [{
                description: "Bạn phải cung cấp ID hoặc tag người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        client.users.fetch(user).then(async user => {
            let banner = await getUserBannerUrl2(user.id);

            if (!banner) return message.reply({
                embeds: [{
                    description: "Người này chưa để ảnh nền.",
                    color: client.config.ERR_COLOR
                }]
            }).then(msg => client.msgDelete(msg));

            await message.reply({
                embeds: [{
                    title: "Banner của " + user.username + "'s",
                    image: { url: banner },
                    footer: {
                        text: "Yêu cầu bởi " + message.author.tag,
                    },
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }).catch(err => {
            if(err.message == "Unknown User") return trys(mesasge.author.id);
            message.botError();
            client.sendError(message.errorInfo, err);
        });

        async function getUserBannerUrl2(userId, { dynamicFormat = true, defaultFormat = "png", size = 4096 } = {}) {

            if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
                throw new Error(`The size '${size}' is not supported!`);
            }

            if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
                throw new Error(`The format '${defaultFormat}' is not supported as a default format!`);
            }

            // We use raw API request to get the User object from Discord API,
            // since the discord.js v12's one doens't support .banner property.
            const user = await client.api.users(userId).get();
            if (!user.banner) return null;

            const query = `?size=${size}`;
            const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;

            if (dynamicFormat) {
                const { headers } = await axios.head(baseUrl);
                if (headers && headers.hasOwnProperty("content-type")) {
                    return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
                }
            }

            return baseUrl + `.${defaultFormat}` + query;
        }
    }
}