const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Xem ping của bot",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.followUp({ content: client.ws.ping + "ms!", ephemeral: true });
    },
};