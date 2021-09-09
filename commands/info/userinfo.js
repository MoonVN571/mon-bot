var { MessageEmbed, Client, Message } = require('discord.js')

const { getTimestamp, getAge } = require("../../utils/utils");

module.exports = {
    name: "userinfo",
    aliases: ["info", "ui"],
    description: "Xem thông tin nguuời dùng.",
    usage: "<PREFIX>ui <username/tag/id>",
    ex: "<PREFIX>ui MoonU",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        var user = args[0] || message.author.id;
        var tag = message.mentions.members.first();

        if (isNaN(user) && !tag) user = message.author.id;
        if (tag) user = tag.id;

        let check_name = client.users.cache.find(user => user.username.toLowerCase() == args.join(" ").toLowerCase());
        if (check_name) user = check_name.id;

        if (!check_name && !tag && isNaN(user)) return message.reprly({
            embeds: [{
                title: client.emoji.failed + "Thiếu thông tin!",
                description: "Bạn phải cung cấp ID hoặc tag người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        if (!tag && isNaN(user)) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Sai thông tin!",
                description: "Bạn phải cung cấp ID hoặc tag người dùng.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        client.users.fetch(user).then(async users => {
            if (!users) return message.reply({
                embeds: [{
                    title: client.emoji.failed + "Sai thông tin!",
                    description: "Bạn đã cung cấp người dùng không hợp lệ.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            const member = message.guild.members.cache.get(users.id);

            let role = member ? member.roles.cache.map(roles => `${roles}`).join(', ').replace(", @everyone", "").replace("@everyone", "None") : "Không có";
            let nickname = member ? (member.user.nickname ? `${member.user.nickname}` : 'Không có') : "Không có";
            let joinServer = member ? `${getTimestamp(member.joinedAt)} \n(${getAge(member.joinedAt)} trước)` : "Không rõ";

            let huyHieu = "Không có";

            const flags = {
                HOUSE_BRAVERY: "Gan dạ",
                HOUSE_BRILLIANCE: "Lõi lạc",
                HOUSE_BALANCE: "Cân bằng"   
            };

            await users.fetchFlags().then(flag => huyHieu = flags[flag.toArray()[0]]);

            const embed = new MessageEmbed()
                .setColor(client.config.DEF_COLOR)
                .setAuthor(users.tag, users.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                .setFooter("Yêu cầu bởi: " + message.author.tag)
                .setThumbnail(users.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                .addField("Username:", `${users.tag}`, true)
                .addField("ID:", `${users.id}`, true)
                .addField("Huy hiệu:", huyHieu, true)
                .addField("Biệt danh:", `${nickname}`, true)
                .addField("Ngày vào server:", `${joinServer}`, true)
                .addField("Ngày tạo tài khoản:", `${getTimestamp(users.createdAt)} \n(${getAge(users.createdAt)} trước)`, true)
                .addField("Roles:", role, true)

            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        });
    },
};