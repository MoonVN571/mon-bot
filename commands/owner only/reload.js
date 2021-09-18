const { Message, Client } = require('discord.js');
var { readdirSync, readdir } = require('fs')

module.exports = {
    name: "reload",
    description: "Tải lại lệnh.",
    aliases: ['rl'],
    dev: true,
    discordDev: true,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        if (!args[0]) return message.reply({
            embeds: [{
                description: "Bạn phải nhập tên lệnh cần reload.\nCách sử dụng: " + client.prefix + "rl reload",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });

        const reloaded = [];
        try {
            args.forEach(cmdReload => {
                readdirSync('./commands').forEach(dir => {
                    readdir(`./commands/${dir}`, async (err, files) => {
                        if (err) throw err;

                        if (files.find(f => f.split('.')[0] == cmdReload)) {
                            delete require.cache[require.resolve(`../../commands/${dir}/${cmdReload}`)]

                            const cmd = require(`../../commands/${dir}/${cmdReload}`);

                            client.commands.set(cmdReload, cmd);
                            reloaded.push(cmdReload);
                        }
                    });
                });
            })
        } catch (err) {
            client.sendError(message.errorInfo, err);
        }

        setTimeout(() => {
            if (!reloaded.join(" ")) return message.reply({
                embeds: [{
                    description: "Bạn phải nhập command bot có.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });
    
            message.reply({
                embeds: [{
                    description: "Đã tải lại lệnh ``" + reloaded.join(", ") + "`` thành công!",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        }, 1 * 1000);
    }
}