const { getAge, getTimestamp } = require('../../utils/utils');
const { Client, Message } = require('discord.js');

module.exports = {
    name: "serverstats",
    aliases: ['svstats', 'servers'],
    description: "Xem stats của server",
    delay: 5,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        const verificationLevels = {
            NONE: 'Không',
            LOW: 'Thấp',
            MEDIUM: 'Vừa phải',
            HIGH: 'Cao',
            VERY_HIGH: 'Cao nhất'
        };

        const tier = {
            NONE: "Không có",
            TIER_1: "Cấp 1",
            TIER_2: "Cấp 2",
            TIER_3: "Cấp 3"
        }

        const serverFilter = {
            DISABLED: "Tắt",
            MEMBERS_WITHOUT_ROLES: "Không có role",
            ALL_MEMBERS: "Mọi người"
        };

        try {
            // await console.log(message.guild.fetchOwner().then(console.log))
            // console.log( message.guild.premiumTier );
            let time = new Date(message.guild.createdTimestamp);

            let role = message.guild.roles.cache.map(r => r.toString());
            let roleCount = role.length;

            if (role.length > 10) {
                let soRole = roleCount - 9;
                if (soRole > 1) soRole = ", và còn " + soRole + " role khác.";
                if(soRole < 1) soRole = "";

                role = role.slice(1, 10) + soRole;
            }

            await client.users.fetch(message.guild.ownerId).then(async owner => {
                await message.reply({
                    embeds: [{
                        author: {
                            name: "Thông tin nhóm: *" + message.guild.name + "*",
                            url: client.user.avatarURL()
                        },
                        thumbnail: { url: message.guild.iconURL() },
                        
                        fields: [
                            {
                                name: "\u300B General",
                                value: "**Tên server**: " + message.guild.name + "\n" +
                                    "**ID server**: " + message.guild.id + "\n" +
                                    "**Owner**: " + owner.tag + "\n" +
                                    "**Bộ lộc**: " + serverFilter[message.guild.explicitContentFilter] + "\n" +
                                    "**Bảo mật**: " + verificationLevels[message.guild.verificationLevel] + "\n" +
                                    "**Ngày tạo nhóm**: " + getTimestamp(time) + " (*" + getAge(time) + " trước*) \n" +
                                    `**Roles [${roleCount}]**: ${role}`,
                                inline: false
                            }, {
                                name: "\u300B Chỉ số",
                                value: "**Cấp độ booster**: " + tier[message.guild.premiumTier] + "\n"
                                    + "**Tổng số booster**: " + message.guild.premiumSubscriptionCount + "\n" +
                                    "**Số emojis**: " + message.guild.emojis.cache.map(e => e.id).length + "\n" +
                                    "**Tổng số kênh**: " + 
                                        message.guild.channels.cache.filter(channel => channel.name).size +
                                        " (" + message.guild.channels.cache.filter(channel => channel.isText()).size + " kênh text và " +
                                        message.guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE").size + " kênh voice)"
                            }
                        ],
                        color: client.config.DEF_COLOR
                    }], allowedMentions: { repliedUser: false }
                });
            })
        } catch (e) { console.log(e) }
    }
}