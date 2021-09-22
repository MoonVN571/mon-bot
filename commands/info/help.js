const { readdirSync } = require('fs');
const Database = require('simplest.db');
const { Client, Message, MessageEmbed } = require('discord.js');
const { Admin } = require('../../config.json');
const { pagination } = require('reconlx');
module.exports = {
    name: "help",
    description: "Xem các lệnh có sẵn",
    usage: "<PREFIX>help <command/aliases>",
    ex: "<PREFIX>help help",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        if (args[0]) {
            let cmdName = args[0];

            const cmd = client.commands.get(cmdName)
                || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

            if (!cmd) return message.channel.send({
                embeds: [{
                    description: "Không tìm thấy hướng dẫn lệnh này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: true }
            }).then(msg => client.msgDelete(msg));

            if ((cmd.disabled || cmd.dev) && Admin !== message.author.id) return message.channel.send({
                embeds: [{
                    description: "Bạn không thể xem thông tin lệnh này.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: true }
            }).then(msg => client.msgDelete(msg));

            const cmdEmbed = new MessageEmbed()
                .setAuthor("Thông tin lệnh", client.user.avatarURL())
                .setColor(client.config.DEF_COLOR)
                .setFooter("Cú pháp <>: Bắt buộc - []: Không bắt buộc")
                .setTimestamp();

            if (cmd.name) cmdEmbed.addField("Tên lệnh", cmd.name, true);
            if (cmd.description) cmdEmbed.addField("Mô tả", cmd.description, true);
            if (cmd.aliases) cmdEmbed.addField("Lệnh rút gọn", "``" + cmd.aliases.join("`` ``") + "``", false)
            if (cmd.usage) cmdEmbed.addField("Cách sử dụng", cmd.usage.replace(/<PREFIX>/ig, client.prefix).replace(/<BOT_MENTIONS>/ig, client.user.toString()));
            if (cmd.ex) cmdEmbed.addField("Ví dụ", cmd.ex.replace(/<PREFIX>/ig, client.prefix).replace(/<EXAMPLE_ID>/ig, "000000000000000000"), true);
            message.reply({ embeds: [cmdEmbed], allowedMentions: { repliedUser: false } });

            return;
        }

        let totalCommands = 0;
        readdirSync('./commands/').forEach(async dir => {
            const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

            commands.forEach((file) => {
                const pull = require(`../../commands/${dir}/${file}`);
                if (pull.name) totalCommands++;
            });
        });

        const defaultEmbed = new MessageEmbed()
            .setAuthor("Help Command", message.guild.iconURL())
            .setDescription(`\u300B Hãy gõ **${client.prefix}help <tên lệnh>** để biết thêm thông tin chi tiết!\n\u300B Bot hiện có **${totalCommands}** lệnh có sẵn.\u200b\n\u200b`)
            .setTimestamp()
            .setColor(client.config.DEF_COLOR)
            .setThumbnail(client.user.avatarURL());

        
        const defaultEmbed2 = new MessageEmbed()
            .setAuthor("Help Command", message.guild.iconURL())
            .setDescription(`\u300B Hãy gõ **${client.prefix}help <tên lệnh>** để biết thêm thông tin chi tiết!\n\u300B Bot hiện có **${totalCommands}** lệnh có sẵn.\u200b\n\u200b`)
            .setTimestamp()
            .setColor(client.config.DEF_COLOR)
            .setThumbnail(client.user.avatarURL());

        let countcategory = 0;
        readdirSync('./commands/').forEach(async dir => {
            if(dir == "owner only") return;

            countcategory++;
            const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
            let cmds = [];

            commands.forEach((file) => {
                const pull = require(`../../commands/${dir}/${file}`);
                if (pull.disabled) return;

                if (pull.name) cmds.push(pull.name);
            });

            if(countcategory < 6) defaultEmbed.addField(dir.toUpperCase() + ` [${cmds.length}]:`, "``" + cmds.join("``, ``") + "``");
            else defaultEmbed2.addField(dir.toUpperCase() + ` [${cmds.length}]:`, "``" + cmds.join("``, ``") + "``"); 
        });

        pagination({
            channel: message.channel,
            author: message.author,
            time: 60000,
            embeds: [defaultEmbed,defaultEmbed2]
        });

        let data = new Database({ path: "./data/footer.json" });
        if (!data.get("text")) return;

        message.channel.send(data.get("text"));
    }
}