const client = require("../index");
const Topgg = require('@top-gg/sdk');
const { AutoPoster } = require('topgg-autoposter');
const express = require('express');
const Database = require('simplest.db');
const { addMoney } = require('../utils/eco');
const { random, sleep } = require('../utils/utils');
const ms = require("ms");
const { readdirSync } = require("fs");
const {MessageActionRow} = require('discord.js');
require('dotenv').config();
client.on('ready',async () => {
    console.log(client.user.tag + " đã sẵn sàng!");

    // SYNC DB BUTTONS
    readdirSync('./data/savedGuildData/button-roles').forEach(async files => {
        if(!files.endsWith(".json")) return;

        let guildId = files.split(".")[0];

        // check bot is in guild or guild exists
        let guilds = client.guilds.cache.get(guildId);
        if(!guilds) return;

        const mainDb = new Database({path:"./data/savedGuildData/button-roles/" + guildId + '.json'});
        
        if(!mainDb.get('to-load')) await mainDb.set('to-load', []);
        let getTotalButton = await mainDb.get('to-load');
        
        let totalButtons = mainDb.get('total-buttons');


        getTotalButton.forEach(async buttonStat => {
            for(let i = 0; i < totalButtons + 1; i++) { // load toàn bộ button đã lưu

                // ở data split channel và id
                let channelId = buttonStat.split(" ")[0];
                let msgId = buttonStat.split(" ")[1];

                // load embed
                const db = new Database({path: "./data/savedGuildData/embeds/" + guildId + ".json"});
                let eb = db.get(channelId + "." + msgId); // embed obj

                // load và add button
                let arrButtondata = await mainDb.get(channelId + "." + msgId + '.buttons');
                const button = new MessageActionRow();
                await arrButtondata.forEach(async data => {
                    button.addComponents(data);
                });

                let checkChannel = client.channels.cache.get(channelId);
                if(!checkChannel) return;

                await checkChannel.messages.fetch(msgId).then(async msg => {
                    msg.edit({
                        embeds: [eb],
                        components: [button]
                    }).then(() => {
                        // create collection
                        const filter = (interaction) => {
                            return !interaction.user.bot;
                        };
                        const collector = msg.createMessageComponentCollector({ filter,componentType: "BUTTON" });
                        collector.on('collect', async interaction => {
                            // load all role in this
                            let roleArr = mainDb.get(channelId + '.' + msgId + '.roles') || [];
                            roleArr.forEach(async roleId => {
                                if (interaction.customId === "button-roles." + channelId + "." + msgId +"."+ roleId) {
                                    let roleName = client.guilds.cache.get(guildId).roles.cache.get(roleId);
                                    if(!roleName) return await interaction.reply({content: "Không tìm thấy role!"}).catch(() => {});
                                    
                                    if(interaction.member.roles.cache.some(r => r.name == roleName.name))
                                        return await interaction.reply({content: "Bạn đã có role này từ trước!", ephemeral: true}).catch(() => {});


                                    // await interaction.deferReply().catch(() => {});
                                    
                                    await interaction.reply({content: "Đã thêm role ``" + roleName.name + "``.", ephemeral: true}).catch(() => {});
                                    interaction.member.roles.add(roleId).catch(() => {});
                                }
                            });
                        });
                    }).catch(() => {});
                }).catch(() => {});
            }
        });
    });



    if (client.config.DEV) return;
    client.user.setPresence({ activities: [{ name: 'RESTARTING', type: "PLAYING" }] });

    // VOTE
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

    // STATUS
    var i = -1;
    setInterval(() => {
        let random = [
            // `${client.guilds.cache.size}/100 servers! | WATCHING`,
            // `${Intl.NumberFormat().format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))} users! | LISTENING`,
            // '@Mon Bot lấy prefix! | PLAYING',
            `Mong chờ đều gì đó... | WATCHING`,
            `@Mon Bot - Prefix: s | LISTENING`,
            `Bot viết bởi Moon | LISTENING`,
            'v1.2.1 updates | WATCHING',
            `${Intl.NumberFormat().format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))} user và ${client.guilds.cache.size} server! | LISTENING`,
            `Bot viết cho vui alo | PLAYING`
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