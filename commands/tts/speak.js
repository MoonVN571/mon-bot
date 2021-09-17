const { getAudioUrl } = require('google-tts-api')
const { createAudioResource, joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const { download, remove } = require('../../utils/utils');
const ms = require('ms');
const { Client, Message } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
    name: "speak",
    aliases: ['s'],
    description: "Đọc tin nhắn trong kênh voice",
    usage: "<PREFIX>speak [nội dung]",
    ex: "<PREFIX>speak Chào mấy bạn",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        if (!message.member.voice.channel) return message.reply({ content: 'Bạn phải vào phòng trước.', allowedMentions: { repliedUser: false } });
        if (!args.length) return message.reply({ content: 'Hãy nhập gì đó để nói.', allowedMentions: { repliedUser: false } });
        if(args.length > 7 || args.join(" ").length > 50) return message.reply({content: "Giới hạn nói mỗi lần là 7 từ! Vote bot tại https://monbot.tk/vote để được nói trên 50 từ.", allowedMentions: { repliedUser: false }})

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.reply({ content: 'Bạn phải vào voice channel để có thể sử dụng lệnh này.', allowedMentions: { repliedUser: false } });

        const botpermission = voiceChannel.permissionsFor(client.user);
        if (!botpermission.has('CONNECT')) return message.reply({ content: 'Bot không có quyền vào channel của bạn!', allowedMentions: { repliedUser: false } });
        if (!botpermission.has('SPEAK')) return message.reply({ content: 'Bot không có quyền nói trong channel của bạn!', allowedMentions: { repliedUser: false } });
        if (!voiceChannel.joinable) return message.reply({ content: 'Bot không vào được phòng của bạn', allowedMentions: { repliedUser: false } });

        // const channelId = message.member.voiceChannel;

        const audioURL = getAudioUrl(args.join(' '), {
            lang: 'qa',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000
        });

        const guildID = message.guild.id;

        let speaking = client.tts.get(guildID + '.speaking');
        if (speaking) return message.reply({ content: "Bot đang nói hãy thử lại sau.", allowedMentions: { repliedUser: false } });

        try {
            let locate = './assets/tts/' + guildID + '.mp3';

            let sounds = readdirSync('./assets/tts/soundboard/').map(sounds => sounds.split(".")[0]);

            if(sounds.indexOf(args[0]) == -1) {
                await remove(locate);
                await download(locate, audioURL, guildID);
            } else {
                locate = './assets/tts/soundboard/' + args[0] + '.mp3';
            }

            const player = createAudioPlayer();
            const resource = createAudioResource(locate);

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guildID,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            connection.subscribe(player);

            client.tts.set(guildID + '.speaking', true);
            client.tts.set(guildID + '.timeout', Date.now() + ms('5m'));

            player.play(resource);
            client.tts.set(guildID + '.speaking', false);

            setTimeout(() => {
                let time = client.tts.get(guildID + '.timeout');
                if (!time) return;
                if (Date.now() > time && message.guild.me?.voice.channel) connection.destroy();

                remove(locate);

                if (!message.guild.me.voice) client.tts.delete(`${guildID}.timeout`);
            }, ms('5m') + 1000);
        } catch (err) {
            client.sendError(err.message);
            message.reply({ content: "Bot xảy ra lỗi thử lại sau!", allowedMentions: { repliedUser: false } });
        }
    }
}