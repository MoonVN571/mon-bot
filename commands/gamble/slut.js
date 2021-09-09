const Database = require('simplest.db');
const { random, layNgauNhien } = require('../../utils/utils');

module.exports = {
    name: "slut",
    description: "Kiếm tiền hoặc bị mất tiền",
    delay: 900,

    execute(client, message, args) {
        const data = new Database({path: './data/eco/' + message.author.id + '.json'});

        const random_money = random(-3000, 10000);
        const user_money = data.get('money');

        if(user_money < random_money || user_money == 0) return message.reply({embeds:[{
            description: "Bạn không có tiền để chơi",
            color: "f10f0f"
        }], allowedMentions: { repliedUser: false }});

        var set_message = [];
        var lay_so_tien_duong = 0;

        if(random_money < 0) {
            lay_so_tien_duong = random_money.toString().substr(1);

            data.number.subtract('money', +lay_so_tien_duong);

            set_message = [
                'Bạn đang cầm tiền về nhà thì bị cướp mất',
                'Bạn vừa bị chẩu thầu vụt mất',
                'Bạn đi làm kiệt sức phải nằm viện, tiền viện phí là',
                'Bạn vừa bị người ta lừa mất',
                'Bạn đã đi chơi về hết'
            ]
        } else {
            lay_so_tien_duong = random_money;

            data.number.add('money', random_money);

            set_message = [
                'Bạn vừa đi làm sml và kiếm được',
                'Bạn đã đứng đường được',
                'Bạn vừa giúp người khác và được trả',
                'Bạn đang đi ngoài đường thì nhặt được',
                'Bạn vừa lừa đảo được'
            ];
        }

        let lay_1_tin = layNgauNhien(set_message);

        message.reply({embeds: [{
            description: lay_1_tin + " " + Intl.NumberFormat().format(lay_so_tien_duong) + client.emoji.dongxu,
            color: "0FF1CE"
        }], allowedMentions: { repliedUser: false }});
    }
}