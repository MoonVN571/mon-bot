const client = require("../index");
const Topgg = require('@top-gg/sdk');
const { AutoPoster } = require('topgg-autoposter');
const express = require('express');
const Database = require('simplest.db');
const { addMoney } = require('../utils/eco');
const { random } = require('../utils/utils');
const ms = require("ms");
require('dotenv').config();
client.on('ready', () => {
    console.log(client.user.tag + " đã sẵn sàng!");

    if (client.config.DEV) return;
    client.user.setPresence({ activities: [{ name: 'RESTARTING', type: "PLAYING" }] });

    const app = express();
    const webhook = new Topgg.Webhook(process.env.AUTHENTICATION);
    
    AutoPoster(process.env.AUTH_TOPGG, client).on('posted', () => console.log('Posted stats to Top.gg!'));

    app.post('/dblwebhook', webhook.listener(vote => {
        client.users.fetch(vote.user).then(user => {
            client.channels.cache.get('887347564905644082').send({embeds: [{
                author:{
                    name: user.username + ", cảm ơn bạn đã vote bot nha :3",
                    icon_url: user.avatarURL()
                },
                title: "Vote ở đây!",
                url: "https://monbot.tk/vote",
                color: "BLUE",
                timestamp: new Date()
            }]});
        }).then(() => {
            let dailyMoney = random(10000, 20000);
            addMoney("Vote", vote.user, dailyMoney);
            const data = new Database({path:'./data/vote.json'});

            // set thời gian vote, nếu vote < hơn 24h sẽ +1 streak
            data.set(`${vote.user}.last-vote`, Date.now());

            let lastVote = data.get(`${vote.user}.last-vote`);
            // hien tai + 2 ngay sau - lastVote, neu < 2 ngay
            // neu lan truoc be hon 1 ngay se + 1 vote
            if(Date.now() - lastVote < ms('1d', { long: true })) {
                data.number.add(`${vote.user}.streak`, 1);
            } else {
                data.set(`${vote.user}.streak`, 0);
            }

            client.users.cache.get(vote.user)
            .send(client.emoji.success + "Bạn đã vote cho bot!\nBạn đã nhận được " + Intl.NumberFormat().format(dailyMoney) + " " + client.emoji.dongxu + " trong lần vote này!")
            .catch(err => client.sendError("Vote " + err.message));
        });
    }));
    
    app.listen(5000);

    var i = -1;
    setInterval(() => {
        let random = [
            `${client.guilds.cache.size}/100 servers! | WATCHING`,
            `${Intl.NumberFormat().format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))} users! | LISTENING`,
            '@Mon Bot lấy prefix! | PLAYING',
        ];

        i++;
        if (i >= random.length) i = 1;

        let data = random[i];

        client.user.setPresence({
            activities: [
                {
                    name: data.split(" | ")[0],
                    type: data.split(" | ")[1]
                }
            ]
        });
    }, 60 * 1000);
});