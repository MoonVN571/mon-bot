const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 * @param {Boolean} return back to author id
 * @return User id
 */
async function getUserId(client, message, args, self) {
    let user = args[0] || message.author.id;
    let tag = message.mentions.members.first();

    if(self && (isNaN(user) && !tag)) user = message.author.id; 
    if(tag) user = tag.id;

    let check_name = client.users.cache.find(user => user.username.toLowerCase() == args.join(" ").toLowerCase());
    if(check_name) user = check_name.id;

    if(!check_name && !tag && isNaN(user)) return false;

    await client.users.fetch(user).then(user =>{
        return user.id;
    }).catch(err => {
        if(err) return false;
    });
}


module.exports = {
    getUserId
}