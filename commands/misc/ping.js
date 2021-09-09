module.exports = {
    name: "ping",
    description: "Xem độ trễ và api.",
    delay: 5,

    async execute(client, message, args) {
        message.reply({ content: "Pinging.. :ping_pong:", allowedMentions: { repliedUser: false } }).then(msg => {
            let calc = msg.createdTimestamp - message.createdTimestamp;
            msg.edit({ content: `Pong! :ping_pong:\nTốc độ phản hồi: ${calc}ms\nTốc độ API: ${Math.round(client.ws.ping)}ms`, allowedMentions: { repliedUser: false } });
        });
    }
}