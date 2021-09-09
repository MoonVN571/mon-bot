const Canvas = require('canvas')
const { Permissions, MessageAttachment } = require('discord.js')
const Database = require('simplest.db');

const { dev } = require('../config.json');
const client = require('../index');

client.on('guildMemberAdd', async (member) => {
    if (member.guild.id == "874862992238473286") {
        if (!dev) {
            let joined = new Database({ path: "./data/joined.json" });

            let data = new Database({ path: "./data/eco/" + member.id + ".json" });
            if (!joined.get("first-join").indexOf(member.user.id) < 0) {
                data.number.add("money", 50000);
                member.send("Bạn đã được cộng 50,000$ vào tài khoản. Gõ ;bal để check!");

                joined.array.push("first-join", member.user.id);
            }
        }
    }

    if(dev) return;
    const guildData = new Database({ path: './data/guilds/' + member.guild.id + ".json" });

    // check muted
    let mutedUser = guildData.get("Muted") || [];

    if(mutedUser.indexOf(member.user.id)) {
        let getMuteRole = member.guild.roles.cache.find(role => role.name == "Muted");

        if(!getMuteRole) return;

        // add mute cho cac channel
        member.guild.channels.cache.forEach(channel => {
            // client.channels.cache.get(channel.id).pe
            if(!member.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return;

            if(!member.guild.me.permissionsIn(channel).has(Permissions.FLAGS.MANAGE_CHANNELS)) return;

            channel.permissionOverwrites.create(getMuteRole, {
                SEND_MESSAGES: false,
            });
        });

        if (member.guild.me.roles.highest.position > getMuteRole.position) member.roles.add(getMuteRole, "Muted user: Cố gắng tránh Mute").catch(err => {});
    }


    const welcome = guildData.get('welcome-channel');

    if (!welcome) return;
    if (!client.channels.cache.get(welcome)) return guildData.delete('welcome-channel');

    const canvas = Canvas.createCanvas(700, 250)
    const ctx = canvas.getContext('2d')

    let background = await Canvas.loadImage('./assets/welcome/background.png');

    if (guildData.get('has-image')) background = await Canvas.loadImage('./assets/welcome/' + member.guild.id + ".png");

    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)

    const pfp = await Canvas.loadImage(
        member.user.displayAvatarURL({
            format: 'png', size: 128,
        })
    )
    x = canvas.width / 2 - pfp.width / 2
    y = 25
    ctx.drawImage(pfp, x, y)

    ctx.fillStyle = '#ffffff'
    ctx.font = '35px sans-serif'
    let text = `Chào mừng, ${member.user.username}`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 60 + pfp.height)

    ctx.font = '30px sans-serif'
    text = `Bạn là thành viên thứ ${member.guild.memberCount} của server!`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 100 + pfp.height)

    const attachment = new MessageAttachment(canvas.toBuffer())

    client.channels.cache.get(welcome).send({ files: [attachment] });
});