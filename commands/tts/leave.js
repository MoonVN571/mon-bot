const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, Message } = require('discord.js');

module.exports = {
    name: "leave",
    description: "Thoát khỏi phòng thoại",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args, serverData) {
        // check bot current channel
        const { guildId } = serverData;
        
        let currentBotVoice = message.guild.me?.voice.channel;
        if(!currentBotVoice) return;

        message.react("<:5174ok:883662153490497586>")

        const connection = joinVoiceChannel({
            channelId: currentBotVoice,
            guildId: guildId,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        connection.destroy();
    }
}