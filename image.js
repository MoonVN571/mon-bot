var gis = require('g-i-s');

module.exports = {
    name: "image",
    description: "Tìm kiếm hình ảnh từ google",
    delay: 5,
    usage: "<PREFIX>image <query>",
    ex: "<PREFIX>image cute cat",
    
    async execute(client, message, args) {
        // return message.reply("Chưa có api -w-.");

        if(!args[0]) return message.reply({embeds: [{
            title: "ERROR",
            description: "Cần nhập tên ảnh bạn cần tìm.\n\nCú pháp: " + client.config.PREFIX + "search <tên>",
            color: client.config.ERR_COLOR
        }], allowedMentions: { repliedUser: false }});

        let input = args.join(" ");

        gis(input, (error, results) => {            
            if (error) return message.reply({embeds: [{
                title: "ERROR",
                description: "Không tìm thấy hình ảnh có tên này.",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }});
            
            try {
                message.reply({embeds: [{
                    title: input.charAt(0).toUpperCase() + input.substr(1),
                    description: "Đây là ảnh của bạn.",
                    image: {
                        url: results[0].url
                    },
                    color: client.config.DEF_COLOR,
                    timestamp: new Date()
                }], allowedMentions: { repliedUser: false }});
            } catch(e) {
                console.log(e);
                message.reply({embeds: [{
                    title: "ERROR",
                    description: "Không tìm thấy hình ảnh nào.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }});
            }
        });
    }
}