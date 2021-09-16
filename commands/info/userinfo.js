var { MessageEmbed, Client, Message } = require('discord.js');
const { user } = require('../..');
const { getUserId } = require('../../utils/user');

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
        let userId = getUserId(client,message,args,true);

        trys(userId);
        function trys(userId) {
            client.users.fetch(userId).then(async users => {
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
            }).catch(err => {
                if(err.message == "Unknown User") return trys(message.author.id);
                message.botError();
                client.send(err);
            })
        }
    },
};