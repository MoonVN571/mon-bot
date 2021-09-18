const { random } = require("../../utils/utils");

module.exports = {
    name: "random",
    description: "Random số ngẫu nhiên",
    aliases: ['rd'],
    usage: "<PREFIX>rd <number>",
    ex: "PREFIXrd 10",

    async execute (client, message, args) {
        let num = parseInt(args[0]);
        if(!args[0] || args[0] == 1) num = 0;

        message.channel.send("Kết quả là **" + (random(0,num) + 1) + "**");
    }
}