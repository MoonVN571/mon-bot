const Database = require('simplest.db');
const { getAge, calculate } = require('../../utils/utils');
const ms = require('ms');
module.exports = {
    name: "daily",
    description: "Nhận quà mỗi ngày.",
    
    execute(client, message, args) {
        const data = new Database({path: './data/vote.json'});
        let lastVote = data.get(`${message.author.id}.last-vote`);
        if(lastVote || (Date.now() - (lastVote + ms('12h')))) {
            message.reply({
                embeds: [{ // now - hien tai  = time | 
                    description: "Bạn đã vote cho bot rồi! Hãy đợi ``" + calculate((Date.now() - (lastVote + ms('12h')))) + "`` để vote tiếp tục vote...",
                    color: "0FF1CE"
                }], allowedMentions: { repliedUser: false }
            });
        } else {
            message.reply({
                embeds: [{
                    description: "Bạn có thể vote bot ngay bây giờ!\nUpvote [tại đây](https://monbot.tk/vote)",
                    color: "0FF1CE"
                }], allowedMentions: { repliedUser: false }
            });
        }
    }
}