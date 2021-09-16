const Discord = require("discord.js")
const axios = require('axios');
const csv = require('csvtojson');
const { getTimestamp } = require("../../utils/utils");
let link = "https://vnexpress.net/microservice/sheet/type/covid19_2021_by_day"

/**
 * Shared by MokaF
 */
module.exports = {
    name: "covid",
    description: "Dịch Covid thông tin chi tiết ở Việt Nam",
    delay: 10,
    vote: true,

    execute(client, message, args) {
        axios.get(link).then(function (response) {
            csv({ noheader: false })
                .fromString(response.data)
                .then((jsonObj) => {
                    let nowtime = new Date()
                    let day = jsonObj.find(({ day_full }) => day_full === nowtime.getFullYear() + "/" + (nowtime.getMonth() + 1) + "/" + nowtime.getDate())

                    const exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setAuthor(
                            'Số liệu được lấy từ báo điện tử VNExpress',
                            'https://cdnmedia.baotintuc.vn/Upload/OND64xLJqhpDJlQ2Gd1dpw/files/2021/01/thong-diep-5k-5121a.jpg',
                            'https://vnexpress.net/covid-19/covid-19-viet-nam'
                        )
                        .setTitle('Thông tin về số ca nhiễm Covid-19 của nước ta')
                        .setDescription(
                            `Số liệu được cập nhật vào ${getTimestamp(nowtime)}`
                        )
                        .setThumbnail('https://cdnmedia.baotintuc.vn/Upload/OND64xLJqhpDJlQ2Gd1dpw/files/2021/01/thong-diep-5k-5121a.jpg')
                        .setFooter("Code bởi: Moka Sakura#5864")
                        .addFields(
                            {
                                name: 'Tổng số ca nhiễm (từ 27/4)',
                                value: `${Intl.NumberFormat().format(day["TỔNG CỘNG ĐỒNG"])}(+${Intl.NumberFormat().format(day["CỘNG ĐỒNG"])})`,
                                inline: true
                            },
                            {
                                name: 'Tổng số tử vong',
                                value: `${Intl.NumberFormat().format(day.total_deaths)}(+${day.new_deaths})`,
                                inline: true
                            },
                            {
                                name: 'Tổng số ca bình phục',
                                value: `${Intl.NumberFormat().format(day.total_recovered_12)}(+${day.new_recovered})`,
                                inline: true
                            },
                            {
                                name: 'Tổng số ca đang được điều tra dịch tễ trong ngày',
                                value: `${Intl.NumberFormat().format(day.community)}`,
                                inline: true
                            },
                            {
                                name: 'Tổng số ca được phát hiện trong khu cách ly trong ngày',
                                value: `${Intl.NumberFormat().format(day.blockade)}`,
                                inline: true
                            },
                            {
                                name: 'Như vậy trong 7 ngày qua',
                                value:
                                    `Cả nước ghi nhận thêm/giảm)  ${Intl.NumberFormat().format(day["diff_mt7_local_cases (35)"])} ca (${day.per_mt7_local_cases})\n` +
                                    `Số ca tử vong (tăng/ giảm) ${Intl.NumberFormat().format(day.diff_mt7_deaths)} ca (${day.per_mt7_deaths})\n` +
                                    `Số người khỏi bệnh (tăng/giảm) ${Intl.NumberFormat().format(day.diff_mt7_recovered)} ca (${day.per_mt7_recovered})`
                            }
                        )

                    message.reply({ embeds: [exampleEmbed], allowedMentions: { repliedUser: false } });
                })
        }).catch(function (error) {
            client.sendErrror(message.errorInfo + error);
            message.reply("Không thể lấy thông tin từ website.");
        });
    }
}