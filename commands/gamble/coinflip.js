const { getMoney, addMoney, apartMoney } = require('../../utils/eco');
const { layNgauNhien, sodep } = require('../../utils/utils');
let maxBet = 100000;
module.exports = {
    name: "coinflip",
    description: "Lật đồng xu hay sao đó.",
    aliases: ['cf'],
    delay: 7,
    usage: "<PREFIX>cf [head/tail] [số tiền]",
    ex: "<PREFIX>cf h 100000",

    execute(client, message, args) {
        let money = getMoney(message.author.id);

        if (money <= 0 || (money < +args[1])) return message.reply({
            embeds: [{
                description: "Bạn không có đủ tiền để chơi",
                color: "f10f0f"
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let sotien = args[1];

        if (!sotien) sotien = args[0] || 1;
        if (sotien === "all") sotien = getMoney(message.author.id);
        if (sotien > maxBet) sotien = maxBet;

        let dat_cuoc = parseInt(sotien);

        let faces = ['head', 'tail'];
        let calc = layNgauNhien(faces);

        let cuoc;

        switch (args[0]) {
            case "tails":
            case "tail":
            case "t": cuoc = "tail";
                break;

            default: cuoc = "head";
        }

        message.reply({ content: "Bạn đã đặt cược vào ``" + cuoc + "`` với số tiền **" + sodep(dat_cuoc) + "** " + client.emoji.dongxu + ".", allowedMentions: { repliedUser: false }
        }).then(msg => {
            setTimeout(() => {
                if (calc == cuoc) {
                    addMoney("Coinflip Win", message.author.id, dat_cuoc);
                    msg.edit({
                        content: "Bạn đã đặt cược vào ``" + cuoc + "`` với số tiền **" +
                            sodep(dat_cuoc) + " " + client.emoji.dongxu + "** và đã thắng."
                        , allowedMentions: { repliedUser: false }
                    });
                } else {
                    apartMoney("Coinflip Lose", message.author.id, dat_cuoc);
                    msg.edit({
                        content: "Bạn cược ``" + cuoc + "`` với số tiền **" +
                            sodep(dat_cuoc) + " " + client.emoji.dongxu + "** và đã thua."
                        , allowedMentions: { repliedUser: false }
                    });;
                }
            }, 5 * 1000);
        })
    }
}