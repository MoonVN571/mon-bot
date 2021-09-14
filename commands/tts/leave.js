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
    async execute(client, message, args) {
        let currentBotVoice = message.guild.me?.voice.channel;
        if(!currentBotVoice) return;
        
        if(message.member.voice.channel.id !== currentBotVoice.id || !message.member.voice.channel)
            return message.reply({ content: 'Bạn phải vào phòng chung với bot.', allowedMentions: { repliedUser: false } });

        message.react("<:5174ok:883662153490497586>");

        const connection = joinVoiceChannel({
            channelId: currentBotVoice,
            guildId: message.guildId,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        connection.destroy();
    }
}