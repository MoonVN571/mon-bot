const { readdir, readdirSync } = require("fs");

module.exports = {
    name: "load",
    dev: true,
    discordDev: true,

    execute(client, message, args) {
        const cmdReload = args[0];

        if (!cmdReload) return message.reply({
            embeds: [{
                title: client.emoji.success + "Cung cấp lệnh",
                description: "Bạn phải nhập tên lệnh để load.\n\n*Cú pháp: " + client.prefix + "load <lệnh>*",
                color: client.config.ERR_COLOR
            }]
        });

        let found = false;

        try {
            readdirSync('./commands').forEach(dir => {
                readdir(`./commands/${dir}`, (err, files) => {
                    if (err) throw err;

                    if (files.find(f => f.split('.')[0] == cmdReload)) {
                        const cmd = require(`../../commands/${dir}/${cmdReload}`);

                        client.commands.set(cmd.name, cmd);
                        found = true;

                        message.reply({
                            embeds: [{
                                title: client.emoji.success + "Thành công",
                                description: "Đã load lệnh ``" + cmdReload + "`` thành công!",
                                color: client.config.DEF_COLOR
                            }], allowedMentions: { repliedUser: true }
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }

        if (!found) return message.reply({
            embeds: [{
                title: client.emoji.failed + "Sai lệnh",
                description: "Không tìm thấy lệnh này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: true }
        });
    }
}