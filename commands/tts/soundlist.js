const { readdirSync } = require('fs');
module.exports = {
    name: "soundlist",
    description: "Xem các âm thanh để play",
    aliases: ['sl'],

    async execute(client, message, args) {
        message.reply({
            content: "```" + readdirSync('./assets/tts/soundboard/').map(sounds => sounds.split(".")[0]).join("``, ``") + "``.",
            allowedMentions: { repliedUser: false }
        });
    }
}