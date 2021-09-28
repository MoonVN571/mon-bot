const Database = require('simplest.db');
const { Client, Message } = require('discord.js');
const { getUser, getServer }=require('../../utils/prem');
const { calculate } = require('../../utils/utils');
const { pagination } = require('reconlx');

module.exports ={
    name: 'premium',
    description: "Xem trạng thái premium",
    aliases: ['pre'],
    delay: 5,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        return message.reply({content: "Tính năng chưa sẵn sàng!", allowedMentions: {repliedUser: false}});

        let getTimeUser = getUser(message.author.id) || "Không có";
        if (getUser(message.author.id)) getTimeUser = calculate(getTimeUser, false);

        let getTimeServer = getServer(message.guild.id) || "Không có";
        if (getServer(message.guildId)) getTimeServer = calculate(getTimeServer, false);

        let timeCreated = new Date();

        pagination({
            channel: message.channel,
            author: message.author,
            time: 60000,
            embeds: [{
                author: {
                    name: "Thông tin của server",
                    icon_url: message.guild.iconURL(),
                },
                title: "Donate",
                description: "Nếu bạn thích bot thì có thể ủng hộ, có thể kham khảo các gói ở trang sau, hãy ấn **nút trang tiếp** để xem thêm thông tin chi tiết.",
                fields: [
                    {
                        name: "Thanh toán",
                        value: "Momo, Paypal, Thẻ Cào"
                    }
                ],
                color: client.config.DEF_COLOR,
                timestamp: timeCreated
            }, {
                author: {
                    name: "Donate Bot",
                    icon_url: message.guild.iconURL(),
                },
                // title: "Chi tiết",
                description: "Một số nâng cấp cho server, bạn có thể kham khảo giá bên dưới\n\u200B",
                fields: [
                    {
                        name: 'Nâng cấp 1 Tháng',
                        value: "20K Bank/ 30K Card / 1$ Paypal",
                        // inline: true
                    },
                    {
                        name: 'Nâng cấp 3 Tháng',
                        value: "70K Bank/ 90K Card / 3$ Paypal",
                        inline: true
                    },
                    {
                        name: 'Nâng cấp 6 Tháng',
                        value: "130K Bank/ 150K Card / 6$ Paypal",
                        inline: false
                    },
                    {
                        name: 'Nâng cấp 12 Tháng',
                        value: "200K Bank/ 250K Card / 6$ Paypal",
                        inline: true
                    },
                ],
                color: client.config.DEF_COLOR,
                timestamp: timeCreated
            }]
        }).catch(err => {
            client.sendError(message.errorInfo, err);
        });
    }
}
