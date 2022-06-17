const Canvas = require('canvas')
const { Permissions, MessageAttachment } = require('discord.js')
const Database = require('simplest.db');

const { dev } = require('../config.json');
const client = require('../index');
const { addMoney } = require('../utils/eco');

client.on('guildMemberAdd', async (member) => {
    if (member.guild.id == "874862992238473286") {
        if (!dev) {
            let joined = new Database({ path: "./data/joined.json" });

            if (joined.get("first-join")?.indexOf(member.user.id) < 0) {
                addMoney("Join dev server", member.user.id, 50000);
                member.send("Bạn đã được cộng 50,000$ vào tài khoản. Gõ ;bal tại kênh server để check!");

                joined.array.push("first-join", member.user.id);
            }
        }
    }

    if(dev) return;
    const guildData = new Database({ path: './data/guilds/' + member.guild.id + ".json" });

    // check muted
    let mutedUser = guildData.get("Muted") || [];

    if(mutedUser.indexOf(member.user.id) > -1) {
        let getMuteRole = member.guild.roles.cache.find(role => role.name == "Muted");
        if(!getMuteRole) return;

        if (member.guild.me.roles.highest.position > getMuteRole.position) member.roles.add(getMuteRole, "Muted user: Cố gắng tránh Mute").catch(err => {});
    }


    const welcome = guildData.get('welcome-channel');

    if (!welcome) return;
    if (!client.channels.cache.get(welcome)) return guildData.delete('welcome-channel');

    const canvas = Canvas.createCanvas(1772, 633);
    const ctx = canvas.getContext('2d');
    
    const background = await Canvas.loadImage(`./assets/welcome/welcome.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f2f2f2';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    var textString3 = `${member.user.username}`;
    
    if (textString3.length >= 14) {
      ctx.font = 'bold 100px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    }
    
    else {
      ctx.font = 'bold 150px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    }
    
    var textString2 = `#${member.user.discriminator}`;
    ctx.font = 'bold 40px Genta';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString2, 730, canvas.height / 2 + 58);
    
    var textString4 = `Bạn là thành viên thứ: #${member.guild.memberCount}`;
    ctx.font = 'bold 60px Genta';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 750, canvas.height / 2 + 125);
    
    var textString4 = `${member.guild.name}`;
    ctx.font = 'bold 60px Genta';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 700, canvas.height / 2 - 150);
    
    ctx.beginPath();
    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);//position of img
    ctx.closePath();
    ctx.clip();
    
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    
    ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
    
    const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    
    client.channels.cache.get(welcome).send({ files: [attachment] });
});