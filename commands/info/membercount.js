
require('dotenv');
const axios = require('axios');

module.exports = {
    name: "membercount",
    description: "Xem số thành viên trong nhóm",
    delay: 60,
    
    execute(client, message, args) {
        axios.get('https://discord.com/api/v8/guilds/' + message.guild.id + '/preview', {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`
            }
        }).then(res => {
            const { approximate_member_count } = res.data

            message.reply({
                embeds: [{
                    description: "Server này hiện có **" + approximate_member_count + "** người.",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        });
    }
}