const { Client, Message } = require('discord.js');
const Database = require("simplest.db");
const { readdirSync } = require('fs');
module.exports = {
    name: "leaderboard",
    description: "Xem top tiền của user",
    delay: 10,
    aliases: ['lb'],

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {

        let totalUserBalance = [];

        readdirSync('./data/eco/').forEach(userLocation => {
            const userData = new Database({ path: './data/eco/' + userLocation });
            let userMoney = userData.get('money') || 0;

            // console.log(userMoney + " " + userLocation.split(".")[0]);

            totalUserBalance.push(userMoney + " " + userLocation.split(".")[0]);
        });

        // lam leader top 10
        totalUserBalance.sort((a, b) => b.split(" ")[0] - a.split(" ")[0]);

        let rankMe = "Không rõ";

        var formated = [];
        var stats = 0;
        totalUserBalance.forEach(data => {
            client.users.fetch(data.split(" ")[1]).then(users => {
                stats++;

                if (data.endsWith(message.author.id)) rankMe = stats;

                formated.push(stats + ") " + users.tag + " ▶ " + Intl.NumberFormat().format(data.split(" ")[0]) + "$");
            });
        });

        setTimeout(async () => {
            if (formated.length > 10) formated = formated.slice(0, 10);

            await message.reply({
                embeds: [{
                    title: "Top 10 | Bản xếp hạng " + client.emoji.dongxu,
                    description: "```" + formated.join("\n") + "```",
                    timestamp: new Date(),
                    footer: { text: "Bạn đứng vị trí thứ " + rankMe + "." },
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }, 2000);
    }
}