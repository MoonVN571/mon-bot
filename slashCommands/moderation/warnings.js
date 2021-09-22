const Database = require('simplest.db');

module.exports = {
    name: "warnings",
    description: "Xem số lần đã bị cảnh cáo của bạn.",
    type: "CHAT_INPUT",

    async execute(client, interaction, args) {
        const userData = new Database({ path: './data/warnings/' + interaction.guild.id + ".json" });
        let count = userData.get(interaction.member.user.id) || 0;

        interaction.followUp({
            embeds: [{
                description: "Bạn có " + count + " cảnh cáo!",
                color: client.config.DEF_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
}