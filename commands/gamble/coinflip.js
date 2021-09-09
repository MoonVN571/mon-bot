const Database = require('simplest.db');

const { layNgauNhien } = require('../../utils/utils');

module.exports = {
    name: "coinflip",
    description: "Lật đồng xu hay sao đó.",
    aliases: ['cf'],
    delay: 7,
    usage: "<PREFIX>cf [head/tail] [số tiền]",
    ex: "<PREFIX>cf head 100000",

    execute (client, message, args) {
        /*
        if(!args[0]) return message.reply({embeds: [{
            title: "Coinflip",
            description: "Bạn phải nhập heads hoặc tails.\n\nCách dùng: " + client.prefix + "cf <heads/tails> <half/quarter/tenth/tiền cược>\n\n" + "*Half: 1/2\nQuarter: 1/4\nTenth: 1/10\nAll: Tiền hiện tại*",
            color: "f10f0f"
        }], allowedMentions: { repliedUser: true } });;

        if(!args[1]) return message.reply({embeds: [{
            title: "Coinflip",
            description: "Bạn phải nhập tiền cược.\n\nCách dùng: " + client.prefix + "cf <heads/tails> <half/quarter/tenth/tiền cược>\n\n" + "*Half: 1/2\nQuarter: 1/4\nTenth: 1/10\nAll: Tiền hiện tại*",
            color: "f10f0f"
        }], allowedMentions: { repliedUser: true } });;
        */

        let data = new Database({path: "./data/eco/" + message.author.id + ".json"});

        let money = data.get("money");

        if(money <= 0 || (money < +args[1])) return message.reply({embeds: [{
            title: "<:1824_coin:883648611592855553> | Tung đồng xu",
            description: "Bạn không có đủ tiền để chơi",
            color: "f10f0f"
        }], allowedMentions: { repliedUser: false } });;

        let choose = args[0];
        let sotien = args[1];

        if(!sotien) sotien = args[0];

        switch(sotien) {
            case "all": choose = data.get("money");
            break;
            case "a": choose = data.get("money");

            break;
            case "half": choose = data.get("money") / 2;
            break;
            case "h": choose = data.get("money") / 2;
            break;

            case "quarter": choose = data.get("money") / 4;
            break;
            case "q": choose = data.get("money") / 4;
            break;

            case "tenth": choose = data.get("money") / 10;
            break;
            case "t": choose = data.get("money") / 10;
            break;

            default: choose = +sotien || 1;
        }

        /*
        if(isNaN(choose)) return message.reply({embeds: [{
            title: "Coinflip",
            description: "Số tiền của bạn phải ở định dạng half / quarter / tenth / all / số tiền.\n\n" + "*Half: 1/2\nQuarter: 1/4\nTenth: 1/10\nAll: Tiền hiện tại*",
            color: "0FF1CE"
        }], allowedMentions: { repliedUser: true } });
        */
       
        let dat_cuoc = parseInt(choose);
        let faces = ['head', 'tail'];
        let calc = layNgauNhien(faces);

        let cuoc;

        switch(args[0]) {
            case "heads": cuoc = "head";
            break;
            case "head": cuoc = "head";
            break;
            case "h": cuoc = "head";
            break;

            case "tails": cuoc = "tail";
            break;
            case "tail": cuoc = "tail";
            break;
            case "t": cuoc = "tail";
            break;

            default: cuoc = "head";
        }

        message.reply({embeds: [{
            title: client.emoji.dongxu + " | Tung đồng xu",
            description: "Bạn đã đặt cược vào " + cuoc + " với " + Intl.NumberFormat().format(dat_cuoc) + "$.",
            color: "0FF1CE"
        }], allowedMentions: { repliedUser: false } }).then(msg => {
            setTimeout(() => {
                if(calc == cuoc) {
                    data.number.add("money", dat_cuoc);
                    msg.edit({embeds: [{
                        title: client.emoji.dongxu + " | Tung đồng xu",
                        description:  "Bạn đã đặt cược vào ``" + cuoc + "`` với số tiền **" +  Intl.NumberFormat().format(dat_cuoc) + "Đ** và đã thắng.\nSố tiền hiện tại " + Intl.NumberFormat().format(data.get("money"))  + "Đ (+" + Intl.NumberFormat().format(dat_cuoc) + "Đ).",
                        color: "0FF1CE"
                    }], allowedMentions: { repliedUser: false } });
                } else {
                    data.number.subtract("money", dat_cuoc);
                    msg.edit({embeds: [{
                        title: client.emoji.dongxu + " | Tung đồng xu",
                        description: "Bạn đã đặt cược vào ``" + cuoc + "`` với số tiền **" + Intl.NumberFormat().format(dat_cuoc) + "Đ** và đã thua.\nSố tiền còn lại " + Intl.NumberFormat().format(data.get("money")) + "Đ (-" + Intl.NumberFormat().format(dat_cuoc) + "Đ).",
                        color: "f10f0f"
                    }], allowedMentions: { repliedUser: false } });;
                }
            }, 5 * 1000);
        })
            
        
    }
}