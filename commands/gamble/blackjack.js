const { Client,Message, Collection, MessageActionRow, MessageButton }= require('discord.js');
const { getMoney, addMoney, apartMoney } = require('../../utils/eco');
const { layNgauNhien, sodep, random } = require('../../utils/utils');
const card = require('../../assets/gamble/cardData.json');
const { getCardValue } = require('../../utils/bj');
const ms = require('ms');
let maxBet = 100000;
const timeout = new Collection();
module.exports = {
    name: "blackjack",
    description: "Xì zách.",
    aliases: ['bj'],
    usage: "<PREFIX>cf [head/tail] [số tiền]",
    ex: "<PREFIX>cf h 100000",
    disabled: true,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {

        let money = getMoney(message.author.id);

        if (money <= 0 || (money < +args[1])) return message.reply({
            embeds: [{
                description: "Bạn không có đủ tiền để chơi",
                color: "f10f0f"
            }], allowedMentions: { repliedUser: false }
        }).then(msg => client.msgDelete(msg));

        let sotien = args[1];

        if (!sotien) sotien = args[0];
        if (sotien === "all") sotien = getMoney(message.author.id);
        if (sotien > maxBet) sotien = maxBet;

        let cardData = card.cardList;
        let cardEmo = card.cardEmo;

        let cardUser = await genCard(3);
        let cardBot = await genCard(3);

        let cardUserArray = cardUser;
        let cardBotArray = cardBot;

        async function genCard(soCard) {
            let gen = [];
            for(let i = 0; i < soCard; i++) {
                let num = random(0, cardData.length);
                gen.push(cardEmo[num]);
                if(i == 2) return gen.slice(1);
            }
        }

        async function nut(array) {
            let nut2 = 0;
            await array.forEach(async element => {
                console.log(getCardValue(element))
                nut2 += getCardValue(element); 
            });
            return nut2;
        }

        // Render
        const button =new MessageActionRow()
        .addComponents(
            new MessageButton().setCustomId(message.author.id + '.bj1').setLabel('Bốc thêm!').setStyle("SUCCESS"),
            new MessageButton().setCustomId(message.author.id + '.bj2').setLabel('Bỏ bài!').setStyle("DANGER")
        );

        let botNutStart = await nut(cardBot);
        let userNutStart = await nut(cardUser);

        if(kq == "HOA"){
                        
        } else if(kq == "THANG") {
            
        } else if(kq == "THUA") {

        } else if(kq == "THANG-3") {

        }

        await message.channel.send({
            embeds: [{
                author: {
                    name: message.author.username + " cược " + sotien + " để choi!",
                    icon_url: message.author.avatarURL()
                },
                fields: [
                    {
                        name: `BOT [${botNutStart}]`, // so nut cua bot
                        value: botNutStart.join(" "), // hien thi so card
                        inline: false
                    },
                    {
                        name: `USER [${userNutStart}]`,
                        value: userNutStart.join(" "),
                        inline: false
                    }
                ]
            }],
            components: [
                button
            ]
        }).then(msg => updateMsg(msg));

        /**
         * 
         * @param {Message} msg 
         */
        async function updateMsg(msg) {
            cardBotArray.push(genCard(random(1,3)));
            cardUserArray.push(genCard(random(1,2)));

            
            const filter = (interaction) => {
                return !interaction.user.bot && interaction.user.id === message.author.id
            };

            const collector = msg.createMessageComponentCollector({ filter, componentType: "BUTTON", time: 10000 });
            collector.on('collect', async interaction => {
                if (interaction.customId == message.author.id + '.bj1') {
                    let nutUser = await nut(cardBotArray);
                    let nutBot = await nut(cardUserArray);

                    let kq = checkWinner(nutBot, nutUser);

                    if(kq == "HOA"){
                        
                    } else if(kq == "THANG") {
                        
                    } else if(kq == "THUA") {

                    } else if(kq == "THANG-3") {

                    } else 
                    msg.edit({
                        embeds: [{
                            author: {
                                name: message.author.username + " cược " + sotien + " để choi!",
                                icon_url: message.author.avatarURL()
                            },
                            fields: [
                                {
                                    name: `BOT [${nutBot}]`, // so nut cua bot
                                    value: nutBot.join(" "), // hien thi so card
                                    inline: false
                                },
                                {
                                    name: `USER [${nutUser}]`,
                                    value: nutBot.join(" "),
                                    inline: false
                                }
                            ]
                        }],
                        components: [
                            button
                    ]});
                } else if (interaction.customId == message.author.id + '.bj2') {

                }
                interaction.deferUpdate();
            });

            collector.on('end', async interaction => {
                timeout.set(message.author.id + '.timeout', Date.now() + ms('5m'));

                setTimeout(() => {
                    let time = timeout.get(message.author.id + '.timeout');
                    if (!time) return;
                    if (Date.now() > time && message.guild.me?.voice.channel) {

                    }
                }, ms('5m') + 1000);

                msg.edit({
                    embeds: [{
                        description:"Hết thời gian chơi, bạn đã bị phạt!",
                        color: "RED"
                    }],
                    components: []
                });
            });
        }

        function checkResult(botCard, userCard) {
            
        }

        function updateWinner(botCard, userCard) {

        }
    }
};
